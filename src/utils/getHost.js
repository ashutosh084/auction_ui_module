const getOrigin = () => {
  // Check for development mode using window.location.hostname
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:9090";
  }
  return window.location.origin;
};

export default getOrigin;
