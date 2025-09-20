export default function Hero() {
  return (
    <section
      className="bg-gradient-to-b from-[#FDF6E3] to-[#F9F1E0] flex flex-col justify-center items-center text-center px-4"
      style={{ minHeight: "60vh" }} // Daha kısa, dinamik yüksekliği artırabiliriz
    >
      <h1 className="text-4xl md:text-5xl font-bold text-[#6B4E31] mb-4 md:mb-6 transition-all duration-200 hover:scale-[1.01] hover:drop-shadow-md">
        Hukukta Güven ve Profesyonellik
      </h1>
      <p className="text-base md:text-lg text-[#6B4E31] mb-6 max-w-xl">
        Av. Can Hayta, ticaret hukuku, aile hukuku ve iş hukuku alanlarında uzman danışmanlık hizmeti sunar.
      </p>
    </section>
  );
}
