export const heading1 = (
  <>
    <h1 className="font-heading mb-6">Explore Our Exquisite Homestay</h1>
    <p className="text-[#4a4a4a] dark:text-[#ffffffea] mb-10 max-w-3xl">
      Our homestay offers a peaceful escape surrounded by nature, with a variety
      of comfortable room types that feature beautiful garden or mountain views.
      Guests can enjoy the convenience of a fully equipped kitchen to prepare
      their own meals, as well as relax with large-screen TVs available in every
      room for cozy entertainment. For those who love the outdoors, our
      refreshing swimming pool provides the perfect place to unwind and take in
      the tranquil surroundings. Whether you’re looking for comfort,
      convenience, or a touch of nature, our homestay has everything you need
      for a relaxing and memorable stay.
    </p>
  </>
);

export const section2 = (
  <div className="md:grid hidden gap-8 grid-cols-1">
    <div className="rounded-2xl overflow-hidden h-48">
      <img
        src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613583/hero-5_kuyoau.jpg"
        alt="hero-1"
        width={300}
        height={300}
        className="img scale-animation"
      />
    </div>

    <div className="grid grid-cols-2 gap-8 h-48">
      <div className="rounded-2xl overflow-hidden">
        <img
          src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613583/hero-2_rlkgxz.jpg"
          alt="hero-2"
          width={300}
          height={300}
          className="img scale-animation"
        />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <img
          src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613583/hero-1_mn0tyb.jpg"
          alt="hero-3"
          width={300}
          height={300}
          className="img scale-animation"
        />
      </div>
    </div>
  </div>
);
