#!/usr/bin/env python3
"""
End-to-end API smoke test for the v1 monolith.

Hits every controller's documented endpoints with realistic payloads, using
the seeded demo accounts (demo@college.com / Demo@123 etc.). Prints a
per-endpoint OK/FAIL line and a final total.

Usage:
    python3 monolith/scripts/api_smoke_test.py [BASE_URL]

    BASE_URL defaults to http://localhost:8080. If you're running this against
    a deployed instance behind a docker network with rate limiting per IP,
    restart the monolith first or run inside the docker network — the v1
    LoginRateLimitFilter blocks bursts of 5 failed logins per IP per 15 min.
"""
import json
import subprocess
import sys

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
BASE = BASE.rstrip("/") + "/api"
HEADERS = ["Content-Type: application/json"]

PASS = 0
FAIL = 0


def req(method, path, token=None, body=None, timeout=10):
    cmd = ["curl", "-s", "-X", method, BASE + path] + sum([["-H", h] for h in HEADERS], [])
    if token:
        cmd += ["-H", "Authorization: Bearer " + token]
    if body is not None:
        cmd += ["-d", json.dumps(body)]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    try:
        d = json.loads(r.stdout)
        return d.get("success", False), d.get("message", ""), d.get("data")
    except Exception:
        return False, "PARSE_ERROR: " + r.stdout[:80], None


def chk(label, method, path, token, body=None):
    global PASS, FAIL
    ok, msg, data = req(method, path, token, body)
    if ok:
        PASS += 1
        print("OK  " + label)
    else:
        FAIL += 1
        print("ERR " + label + " => " + msg[:80])
    return ok, data


# ── LOGIN ────────────────────────────────────────────────────────────────────
print("=" * 65)
print("LOGIN")
print("=" * 65)
_, _, ad = req("POST", "/auth/login", body={"identifier": "demo@college.com",   "password": "Demo@123"})
_, _, st = req("POST", "/auth/login", body={"identifier": "student@demo.com",   "password": "Demo@123"})
_, _, fa = req("POST", "/auth/login", body={"identifier": "staff@demo.com",     "password": "Demo@123"})
AT = ad["token"] if ad else None
ST = st["token"] if st else None
FT = fa["token"] if fa else None
print("ADMIN:%s  STUDENT:%s  FACULTY:%s" % (bool(AT), bool(ST), bool(FT)))
if not AT:
    print("FATAL: admin login failed — seed data missing or rate-limit hit. Aborting.")
    sys.exit(1)

# ── Probe IDs for path params ────────────────────────────────────────────────
_, _, courses = req("GET", "/courses", AT)
cid = None
if courses and isinstance(courses, dict):
    arr = courses.get("content", [])
    cid = str(arr[0]["id"]) if arr else None
elif courses and isinstance(courses, list):
    cid = str(courses[0]["id"]) if courses else None

_, _, sme = req("GET", "/students/me", ST)
sid = str(sme["id"]) if sme else None
_, _, eme = req("GET", "/employees/me", FT)
eid = str(eme["id"]) if eme else None
_, _, dl = req("GET", "/departments", AT)
did = str(dl[0]["id"]) if dl else None

print(f"cid={cid}  sid={sid}  eid={eid}  did={did}")

# ── AUTH ────────────────────────────────────────────────────────────────────
print("\n=== AUTH ===")
chk("GET  /auth/me (admin)",         "GET",  "/auth/me", AT)
chk("PUT  /auth/profile",            "PUT",  "/auth/profile", AT, {"name": "Demo Admin"})
chk("PUT  /auth/update-mobile",      "PUT",  "/auth/update-mobile", AT, {"newMobile": "9090909090"})
ok_cp, _ = chk("PUT  /auth/change-password", "PUT", "/auth/change-password", AT,
               {"currentPassword": "Demo@123", "newPassword": "Demo@456"})
if ok_cp:
    req("PUT", "/auth/change-password", AT, {"currentPassword": "Demo@456", "newPassword": "Demo@123"})

# ── DEPARTMENTS ──────────────────────────────────────────────────────────────
print("\n=== DEPARTMENTS ===")
chk("GET  /departments", "GET", "/departments", AT)
if did:
    chk("GET  /departments/{id}", "GET", "/departments/" + did, AT)
ok_d, nd = chk("POST /departments", "POST", "/departments", AT,
               {"name": "TmpXX", "code": "TXX9", "description": "t"})
nid = str(nd["id"]) if (ok_d and nd and nd.get("id") is not None) else None
if nid:
    chk("PUT  /departments/{id}", "PUT", "/departments/" + nid, AT,
        {"name": "TmpXX2", "code": "TXX9", "description": "u"})
    chk("DELETE /departments/{id}", "DELETE", "/departments/" + nid, AT)

# ── STUDENTS ─────────────────────────────────────────────────────────────────
print("\n=== STUDENTS ===")
chk("GET  /students",                "GET", "/students",                AT)
chk("GET  /students/me",             "GET", "/students/me",             ST)
chk("GET  /students/me/info",        "GET", "/students/me/info",        ST)
chk("GET  /students/me/bank-info",   "GET", "/students/me/bank-info",   ST)
chk("PUT  /students/me/bank-info",   "PUT", "/students/me/bank-info",   ST,
    {"bankName": "SBI", "accountNumber": "1234567890",
     "ifscCode": "SBIN0001234", "accountHolderName": "Test"})
if sid:
    chk("GET  /students/{id}", "GET", "/students/" + sid, AT)

# ── EMPLOYEES ────────────────────────────────────────────────────────────────
print("\n=== EMPLOYEES ===")
chk("GET  /employees",    "GET", "/employees",    AT)
chk("GET  /employees/me", "GET", "/employees/me", FT)
if eid:
    chk("GET  /employees/{id}", "GET", "/employees/" + eid, AT)

# ── COURSES / LMS ────────────────────────────────────────────────────────────
print("\n=== COURSES / LMS ===")
chk("GET  /courses",       "GET", "/courses",       AT)
chk("GET  /announcements", "GET", "/announcements", ST)
chk("GET  /quizzes",       "GET", "/quizzes",       ST)
if cid:
    chk("GET  /courses/{id}",              "GET", "/courses/" + cid,             AT)
    chk("GET  /courses/{id}/materials",    "GET", "/courses/" + cid + "/materials",   ST)
    chk("GET  /courses/{id}/assignments",  "GET", "/courses/" + cid + "/assignments", ST)
    chk("GET  /announcements/course/{id}", "GET", "/announcements/course/" + cid,     ST)

# ── ENROLLMENTS ──────────────────────────────────────────────────────────────
print("\n=== ENROLLMENTS ===")
if sid:
    chk("GET  /enrollments/student/{id}", "GET", "/enrollments/student/" + sid, AT)
if cid:
    chk("GET  /enrollments/course/{id}", "GET", "/enrollments/course/" + cid, AT)

# ── ATTENDANCE ───────────────────────────────────────────────────────────────
print("\n=== ATTENDANCE ===")
if sid:
    chk("GET  /attendance/student/{id}",         "GET", "/attendance/student/" + sid,             AT)
    chk("GET  /attendance/student/{id}/summary", "GET", "/attendance/student/" + sid + "/summary", AT)
if eid:
    chk("GET  /attendance/employee/{id}", "GET", "/attendance/employee/" + eid, AT)

# ── ACADEMICS ────────────────────────────────────────────────────────────────
print("\n=== ACADEMICS ===")
for ep in [
    "/academics/wishlist", "/academics/courses/registered",
    "/academics/exc/available", "/academics/exc/registered",
    "/academics/mooc", "/academics/internship", "/academics/conference",
    "/academics/projects/open", "/academics/projects/applications",
    "/academics/registration-schedule",
]:
    chk("GET  " + ep, "GET", ep, ST)
chk("POST /academics/wishlist", "POST", "/academics/wishlist", ST,
    {"courseCode": "CS0001", "courseName": "Test", "credits": 3})
chk("POST /academics/mooc", "POST", "/academics/mooc", ST,
    {"platform": "Coursera", "courseName": "ML",
     "completionDate": "2025-12-01", "certificateUrl": "http://example.com"})
chk("POST /academics/internship", "POST", "/academics/internship", ST,
    {"companyName": "TCS", "role": "Intern",
     "startDate": "2025-05-01", "endDate": "2025-07-31"})
chk("POST /academics/conference", "POST", "/academics/conference", ST,
    {"conferenceName": "ICSE", "venue": "Chennai",
     "date": "2025-11-20", "paperTitle": "Test"})

# ── LEAVE ────────────────────────────────────────────────────────────────────
print("\n=== LEAVE ===")
chk("GET  /leaves/my",      "GET", "/leaves/my",      FT)
chk("GET  /leaves",         "GET", "/leaves",         AT)
chk("GET  /leaves/balance", "GET", "/leaves/balance", FT)
ok_lv, lv = chk("POST /leaves", "POST", "/leaves", FT,
                {"leaveType": "SICK", "fromDate": "2025-12-23",
                 "toDate": "2025-12-24", "reason": "Illness"})
lvid = str(lv["id"]) if (ok_lv and lv and lv.get("id") is not None) else None
if lvid:
    chk("PUT  /leaves/{id}/approve", "PUT", "/leaves/" + lvid + "/approve", AT,
        {"reviewNote": "OK"})

# ── EXAMINATION ──────────────────────────────────────────────────────────────
print("\n=== EXAMINATION ===")
for ep in [
    "/examination/schedule", "/examination/marks", "/examination/grades",
    "/examination/grade-history", "/examination/online-exam/scheduled",
    "/examination/arrear/eligible", "/examination/arrear/registrations",
    "/examination/arrear/schedule", "/examination/arrear/attempts",
    "/examination/makeup/applications",
]:
    chk("GET  " + ep, "GET", ep, ST)
chk("POST /examination/makeup/apply", "POST", "/examination/makeup/apply", ST,
    {"courseCode": "CS3201", "courseName": "Data Structures",
     "reason": "Medical", "absenceDate": "2025-11-15"})

# ── FINANCE ──────────────────────────────────────────────────────────────────
print("\n=== FINANCE ===")
chk("GET  /finance/fees",     "GET",  "/finance/fees",     ST)
chk("GET  /finance/receipts", "GET",  "/finance/receipts", ST)
chk("GET  /finance/wallet",   "GET",  "/finance/wallet",   ST)
chk("GET  /finance/refunds",  "GET",  "/finance/refunds",  ST)
chk("POST /finance/wallet/add", "POST", "/finance/wallet/add", ST, {"amount": 100, "mode": "CASH"})
chk("POST /finance/refunds",    "POST", "/finance/refunds",    ST,
    {"amount": 50, "reason": "Overpayment", "feeType": "TUITION"})

# ── PAYROLL ──────────────────────────────────────────────────────────────────
print("\n=== PAYROLL ===")
chk("GET  /payroll",          "GET", "/payroll",          AT)
chk("GET  /payroll/my",       "GET", "/payroll/my",       FT)
chk("POST /payroll/generate", "POST", "/payroll/generate", AT, {"month": 12, "year": 2025})

# ── SERVICES ─────────────────────────────────────────────────────────────────
print("\n=== SERVICES ===")
for ep in [
    "/services/bonafide", "/services/library/issued",
    "/services/library/recommendations", "/services/library/stats",
    "/services/requests", "/services/health-feedback",
]:
    chk("GET  " + ep, "GET", ep, ST)
chk("POST /services/bonafide", "POST", "/services/bonafide", ST,
    {"purpose": "Bank Account", "addressRequired": True})
chk("POST /services/library/recommend", "POST", "/services/library/recommend", ST,
    {"title": "Clean Code", "author": "Martin", "isbn": "9780132350884"})
chk("POST /services/requests", "POST", "/services/requests", ST,
    {"type": "TRANSCRIPT", "description": "Need transcript"})
chk("GET  /services/requests/TRANSCRIPT", "GET", "/services/requests/TRANSCRIPT", ST)
chk("POST /services/health-feedback", "POST", "/services/health-feedback", ST,
    {"rating": 4, "comments": "Good service"})

# ── FEEDBACK ─────────────────────────────────────────────────────────────────
print("\n=== FEEDBACK ===")
chk("GET  /feedback/status", "GET",  "/feedback/status", ST)
chk("GET  /feedback/247",    "GET",  "/feedback/247",    ST)
chk("POST /feedback/247",    "POST", "/feedback/247",    ST,
    {"courseCode": "CS3201", "feedbackType": "SUGGESTION",
     "feedbackText": "The course content is excellent and very well structured for students learning the subject."})

# ── RESEARCH ─────────────────────────────────────────────────────────────────
print("\n=== RESEARCH ===")
chk("GET  /research/profile",     "GET",  "/research/profile",     ST)
chk("GET  /research/weekly-logs", "GET",  "/research/weekly-logs", ST)
chk("POST /research/weekly-logs", "POST", "/research/weekly-logs", ST,
    {"week": "2025-W49", "hoursWorked": 38,
     "activitiesDone": "Data collection", "planForNextWeek": "Analysis"})

# ── NOTIFICATIONS ────────────────────────────────────────────────────────────
print("\n=== NOTIFICATIONS ===")
chk("GET  /notifications",                "GET",  "/notifications",               ST)
chk("GET  /notifications/unread-count",   "GET",  "/notifications/unread-count",  ST)
chk("POST /notifications/mark-all-read",  "POST", "/notifications/mark-all-read", ST)

print("\n" + "=" * 65)
print("TOTAL  OK: %d   FAIL: %d   (of %d tested)" % (PASS, FAIL, PASS + FAIL))
print("=" * 65)
sys.exit(0 if FAIL == 0 else 1)
