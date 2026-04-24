export function getAuthErrorMessage(error: unknown) {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("email not confirmed")) {
    return "Check your email and confirm your account before signing in."
  }

  if (message.includes("invalid login credentials")) {
    return "The email or password is incorrect."
  }

  if (message.includes("provider is not enabled")) {
    return "This sign-in provider is not enabled in Supabase yet."
  }

  return error.message;
}
