export const partnerWallImages = Array.from({ length: 64 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

  return {
    id: number,
    src: `/partners/${number}.png`,
    alt: `合作伙伴素材 ${number}`,
  };
});
