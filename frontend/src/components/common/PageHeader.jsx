import React from 'react'

export default function PageHeader({ title, subtitle, badge, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3 font-sans">
      <div>
        {badge && (
          <div className="mb-2 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-500">
            {badge}
          </div>
        )}
        <h1 className="mb-1.5 text-[22px] font-extrabold tracking-tight text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 text-sm text-slate-500">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
