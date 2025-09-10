export const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      // Redirect to login page
      window.location.href = '/'
    }
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if API call fails
    window.location.href = '/'
  }
}

export const getCurrentUser = () => {
  try {
    const userInfoCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('user-info='))
      ?.split('=')[1]

    if (!userInfoCookie) {
      return null
    }

    return JSON.parse(decodeURIComponent(userInfoCookie))
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export const isAuthenticated = () => {
  return getCurrentUser() !== null
}
