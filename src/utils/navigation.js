export function goHomeContact(navigate) {
  navigate('/')
  setTimeout(() => {
    const el = document.getElementById('contact')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 60)
}
