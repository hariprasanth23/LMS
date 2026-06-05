import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import toast from 'react-hot-toast'
import { MdSchool } from 'react-icons/md'

const ACCENT = '#6366f1'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all required fields')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const pwdPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/
    if (!pwdPattern.test(form.password)) {
      toast.error('Password must be 8+ chars with uppercase, lowercase, digit, and special character')
      return
    }
    setLoading(true)
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role
      })
      toast.success('Registration successful! Please login.')
      navigate('/auth/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'system-ui, sans-serif',
    color: '#1e293b',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff'
  }

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#374151',
    marginBottom: 6,
    fontFamily: 'system-ui, sans-serif'
  }

  const field = (label, name, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder || label}
        style={inputStyle}
        onFocus={(e) => e.target.style.borderColor = ACCENT}
        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
      />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '36px',
        width: '100%',
        maxWidth: 440,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            width: 52,
            height: 52,
            background: ACCENT,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <MdSchool style={{ color: '#fff', fontSize: 28 }} />
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1e293b', fontFamily: 'system-ui, sans-serif' }}>
            Create Account
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#64748b', fontFamily: 'system-ui, sans-serif' }}>
            Join College ERP
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {field('Full Name *', 'name', 'text', 'Enter your full name')}
          {field('Email Address *', 'email', 'email', 'Enter your email')}
          {field('Phone Number', 'phone', 'tel', 'Enter phone number')}
          {field('Password *', 'password', 'password', 'Create a password')}
          {field('Confirm Password *', 'confirmPassword', 'password', 'Confirm your password')}

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="STAFF">Staff</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: loading ? '#a5b4fc' : ACCENT,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'system-ui, sans-serif',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, fontFamily: 'system-ui, sans-serif', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/auth/login" style={{ color: ACCENT, fontWeight: 600, textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}
