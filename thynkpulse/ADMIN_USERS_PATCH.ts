// ═══════════════════════════════════════════════════════════════════
//  THYNK PULSE — Admin Users Page PATCH
//  Changes to apply to: app/admin/users/page.tsx
// ═══════════════════════════════════════════════════════════════════
//
//  1. Add verifyMutation alongside toggleMutation
//  2. Add ✅ Verified column to the table header
//  3. Add Verify/Unverify button in Actions column
//  4. Show ✅ Verified badge chip next to user name
//
// ───────────────────────────────────────────────────────────────────
//  STEP 1 — Add verifyMutation (insert after toggleMutation block)
// ───────────────────────────────────────────────────────────────────

/*
  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }: { id: string; isVerified: boolean }) =>
      apiPut(`/admin/users/${id}`, { isVerified }),
    onSuccess: (_, { isVerified }) => {
      toast.success(isVerified ? '✅ User verified' : 'Verification removed')
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => toast.error('Action failed'),
  })
*/

// ───────────────────────────────────────────────────────────────────
//  STEP 2 — Table header: add after the "Status" <th>
// ───────────────────────────────────────────────────────────────────

/*
  <th style={hd}>Verified</th>
*/

// ───────────────────────────────────────────────────────────────────
//  STEP 3 — Table row: add after the Status <td> and before Actions
// ───────────────────────────────────────────────────────────────────

/*
  <td style={cell}>
    {u.isVerified
      ? <span style={{ display:'inline-flex', alignItems:'center', gap:'3px', fontSize:'11px', fontWeight:700, color:'#0A5F55', background:'rgba(10,95,85,.08)', border:'1px solid rgba(10,95,85,.2)', borderRadius:'100px', padding:'2px 8px' }}>✅ Verified</span>
      : <span style={{ fontSize:'11px', color:'var(--muted)' }}>—</span>
    }
  </td>
*/

// ───────────────────────────────────────────────────────────────────
//  STEP 4 — In Actions <td>, add Verify button inside the flex div
// ───────────────────────────────────────────────────────────────────

/*
  <button
    onClick={() => verifyMutation.mutate({ id: u.id, isVerified: !u.isVerified })}
    title={u.isVerified ? 'Remove verification' : 'Verify this user'}
    style={{
      display: 'flex', alignItems: 'center', gap: '4px',
      padding: '5px 9px', borderRadius: '6px', border: 'none',
      cursor: 'pointer', fontSize: '11px', fontWeight: 600,
      fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
      background: u.isVerified ? 'rgba(239,68,68,.08)' : 'rgba(10,95,85,.08)',
      color: u.isVerified ? '#F87171' : '#0A5F55',
    }}
  >
    {u.isVerified ? '✗ Unverify' : '✅ Verify'}
  </button>
*/

// ───────────────────────────────────────────────────────────────────
//  STEP 5 — In the user name cell, show ✅ after name if verified
//  (find the cell rendering u.fullName or u.email and add this span)
// ───────────────────────────────────────────────────────────────────

/*
  {u.isVerified && (
    <span style={{ marginLeft:4, fontSize:'11px' }} title="Verified">✅</span>
  )}
*/

// ───────────────────────────────────────────────────────────────────
//  ALSO: The existing admin/users/[id]/route.ts already supports
//  isVerified via PUT — no backend changes needed.
//  The route.ts snippet is already:
//    if (isVerified !== undefined) { updates.push(`is_verified = $${idx++}`); vals.push(isVerified) }
// ───────────────────────────────────────────────────────────────────

export {} // TypeScript module marker - remove this line when applying the patch
