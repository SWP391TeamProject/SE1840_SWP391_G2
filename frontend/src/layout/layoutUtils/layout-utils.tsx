export const checkScrollPositionAndReset = () => {
  const scrollPosition = window.pageYOffset;
  const totalPageHeight = document.body.scrollHeight;
  const scrollPercentage = (scrollPosition / totalPageHeight) * 100;

  if (scrollPercentage > 70) {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    });
  }
};
