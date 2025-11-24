const XorGate = ({
  fill,
  className,
}: {
  fill?: string;
  className?: string;
}) => (
  <svg
    width="61"
    height="32"
    viewBox="0 0 61 32"
    fill={fill}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.40265 0.676126C9.73788 5.07228 11.0865 10.1607 11.0865 15.5953C11.0865 21.0415 9.73788 26.13 7.40265 30.5261M50.9425 15.5953H60.5M0.5 8.09535H10.0575M0.5 23.0953H10.0575M12.7124 0.595348V0.676126C15.0476 5.07228 16.3963 10.1607 16.3963 15.5953C16.3963 21.0415 15.0476 26.13 12.7124 30.5261V30.5953H27.0158C37.2211 30.5953 46.1308 24.5607 50.9096 15.5953C46.1308 6.6415 37.2211 0.595348 27.0158 0.595348H12.7124Z"
      stroke="black"
    //   strokeLinecap="square"
    />
  </svg>
);

export default XorGate;
