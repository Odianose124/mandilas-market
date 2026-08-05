function TopBanner() {
  const messages = [
    "🎉 Welcome to Mandilas Market",
    "🚚 Nationwide Delivery",
    "🛍️ Buy Directly from Trusted Mandilas Sellers",
    "💳 Secure Payments",
    "🔥 Amazing Fashion Deals Every Day",
  ];

  return (
    <section className="w-full bg-[#FEE9C7] border-b border-gray-200">
      <div className="marquee-container">
        <div className="marquee-content">
          {[...messages, ...messages].map((message, index) => (
            <span key={index} className="marquee-item">
              {message}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopBanner;