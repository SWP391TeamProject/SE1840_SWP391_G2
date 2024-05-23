/**
 * Retrieves the value of a cookie by its name.
 * @param cookieName - The name of the cookie to retrieve.
 * @returns The value of the cookie, or an empty string if the cookie is not found.
 */
export function getCookie(cookieName: string) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * Sets a cookie with the specified name, value, and expiration time.
 * @param cookieName - The name of the cookie.
 * @param cookieValue - The value to be stored in the cookie.
 * @param cookieExp - The expiration time of the cookie in days.
 */
export function setCookie(
  cookieName: string,
  cookieValue: string,
  cookieExp: number
) {
  const d = new Date();
  d.setTime(d.getTime() + cookieExp * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}
