import React from "react";
import SectionSvg from "../components/ui/SectionSvg";
import PlusSvg from "../components/ui/PlusSvg";
import brackets from "../components/ui/Brackets";

// Integrated TagLine component
const TagLine = ({ className, children }) => {
  return (
    <div className={`tagline flex items-center ${className || ""}`}>
      {brackets("left")}
      <div className="mx-3 text-n-3">{children}</div>
      {brackets("right")}
    </div>
  );
};

// Integrated Heading component
const Heading = ({ className, title, text, tag }) => {
  return (
    <div
      className={`${className} max-w-[50rem] mx-auto mb-12 lg:mb-20 md:text-center text-5xl font-bold`}
    >
      {tag && <TagLine className="mb-4 md:justify-center">{tag}</TagLine>}
      {title && <h2 className="h2">{title}</h2>}
      {text && <p className="body-2 mt-4 text-white">{text}</p>}
    </div>
  );
};

// Integrated Section component
const Section = ({
  className,
  id,
  crosses,
  crossesOffset,
  customPaddings,
  children,
}) => {
  return (
    <div
      id={id}
      className={`
      relative 
      ${
        customPaddings ||
        `py-10 lg:py-16 xl:py-20 ${crosses ? "lg:py-32 xl:py-40" : ""}`
      } 
      ${className || ""}`}
    >
      {children}

      <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-white pointer-events-none md:block lg:left-7.5 xl:left-10" />
      <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-white pointer-events-none md:block lg:right-7.5 xl:right-10" />

      {crosses && (
        <>
          <div
            className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-white ${
              crossesOffset && crossesOffset
            } pointer-events-none lg:block xl:left-10 right-10`}
          />
          <SectionSvg crossesOffset={crossesOffset} />
        </>
      )}
    </div>
  );
};

// Main About component
const About = () => {
  return (
    <Section className="bg-white">
      <div className="container text-gray-800">
        <Heading title="About Us" />
        <p className="text-gray-800 mb-14 text-justify">
          At Play2earn, we are dedicated to transforming the micro-engagement
          landscape through our extensive expertise and broad user base. Our
          goal is to build a dynamic, decentralized network where people from
          around the world, regardless of their crypto knowledge, can engage in
          meaningful interactions to support business growth. We aspire to
          create a globally connected community, where every interaction fuels
          the expansion of a thriving digital economy.
        </p>

        <div className="relative bg-white">
          <div className="bg-sky-200 relative z-1 flex items-center h-[39rem] mb-5 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 xl:h-[40rem]">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none hidden md:block">
              <img
                className="w-1000 h-full object-cover md:object-right"
                alt="Crypto"
                src="/assets/crypto.png"
              />
            </div>

            <div className="relative z-1 max-w-[17rem] ml-auto">
              <h4 className="h4 mb-4 text-gray-800 text-2xl">Our Mission</h4>
              <p className="body-2 text-gray-800 ">
                At Play2Earn.ai, our mission is to create a platform where
                gaming and AI development work hand in hand, rewarding players
                for their time, skill, and contributions to AI advancements.
                We’re building an ecosystem where gameplay fuels AI evolution,
                ensuring that everyone benefits from the intersection of play
                and purpose. Through this innovative approach, we’re empowering
                players to actively shape the future of technology while earning
                rewards in a mutually beneficial environment.
              </p>
            </div>
          </div>

          {/* what we do and Vision Section */}
          <div className="relative bg-white mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative border border-n-1/10 rounded-3xl p-8 bg-sky-100">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h4 className="h4 mb-4 text-gray-800 text-2xl">What we do</h4>
                  <p className="body-2 text-gray-800 text-justify">
                    At Play2Earn.ai, what we do is creating a platform where
                    gaming and AI development work hand in hand, rewarding
                    players for their time, skill, and contributions to AI
                    advancements. We’re building an ecosystem where gameplay
                    fuels AI evolution, ensuring that everyone benefits from the
                    intersection of play and purpose. Through this innovative
                    approach, we’re empowering players to actively shape the
                    future of technology while earning rewards in a mutually
                    beneficial environment.
                  </p>
                </div>
              </div>
              <div className="relative border border-n-1/10 rounded-3xl p-8 bg-sky-100">
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <h4 className="h4 mb-4 text-gray-800 text-2xl">Our Vision</h4>
                  <p className="body-2 text-gray-800 text-justify">
                    At Play2Earn.ai, we envision a world where gaming goes
                    beyond entertainment to become a catalyst for technological
                    advancement and personal growth. Our goal is to make gaming
                    a meaningful experience that contributes to AI and digital
                    innovation while providing real-world rewards. By blending
                    immersive gameplay with cutting-edge technology, we aim to
                    build a global community that shapes the future of
                    technology and fosters collaboration through play.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-1 grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[39rem] border border-n-1/10 rounded-3xl overflow-hidden bg-sky-300">
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-b from-sky-200 to-sky-300 lg:p-15">
                <h4 className="h4 mb-4 text-gray-800 text-2xl">
                  Start earning from Anywhere
                </h4>
                <p className="body-2 mb-[0rem] text-gray-800 text-justify">
                  Earn rewards from anywhere! Work remotely and engage in tasks
                  at your convenience, enjoying the freedom to make the most of
                  your time while earning valuable rewards.
                </p>
                <img
                  className="h-full object-cover md:object-right"
                  alt="Global"
                  src="/assets/global1.png"
                />
              </div>
            </div>

            <div className="relative min-h-[50rem] rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 to-sky-300">
              <div className="relative z-10 py-8 px-4 xl:px-8">
                <h4 className="h4 mb-4 text-gray-800 text-2xl">Task Rewards</h4>
                <p className="body-2 mb-0 text-gray-800 text-justify">
                  Complete micro tasks and earn rewards effortlessly! Enjoy
                  quick, easy tasks that fit your schedule, turning small
                  efforts into valuable rewards.
                </p>
              </div>
              <img
                alt="Reward"
                src="/assets/reward1.png"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* General info */}
            <div className="relative p-4 bg-gradient-to-b bg-sky-200 rounded-xl overflow-hidden lg:min-h-[20rem] lg:min-w-[80rem]">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 py-12 px-6 xl:px-12">
                <div className="relative flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-sky-200 rounded-full absolute -left-12 -top-12 opacity-50"></div>
                    <div className="w-16 h-16 bg-sky-200 rounded-full absolute right-4 bottom-4 opacity-40"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 p-4">
                    Total Users
                  </h4>
                  <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
                </div>
                <div className="relative flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-sky-200 rounded-full absolute -left-12 -top-12 opacity-50"></div>
                    <div className="w-16 h-16 bg-sky-200 rounded-full absolute right-4 bottom-4 opacity-40"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 p-4">
                    Completed Tasks
                  </h4>
                  <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
                </div>
                <div className="relative flex flex-col items-center bg-white rounded-lg p-6 shadow-lg border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-sky-200 rounded-full absolute -left-12 -top-12 opacity-50"></div>
                    <div className="w-16 h-16 bg-sky-300 rounded-full absolute right-4 bottom-4 opacity-40"></div>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 p-4">
                    Total Paid Out
                  </h4>
                  <h4 className="text-2xl font-bold text-gray-800">100k+</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="relative bg-white pt-5">
          <div className="container mx-auto">
            <div className="relative bg-sky-200 flex flex-col items-center py-16 px-8 border border-n-1/10 rounded-3xl overflow-hidden">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Our Roadmap
              </h2>
              <p className="text-gray-800 mb-8 text-center">
                Check out our journey and future plans as we continue to
                innovate and expand. Our roadmap outlines the key milestones and
                upcoming features that will shape the future of Play2earn.
              </p>
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8">
                  <div className="relative flex flex-col items-center w-full md:w-1/4">
                    <div className="relative z-10 bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center h-[14rem] flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                          Q1 2024
                        </h4>
                        <p className="text-gray-600">
                          Launch of our new task types and expanded crypto
                          educational resources.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center w-full md:w-1/4">
                    <div className="relative z-10 bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center h-[14rem] flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                          Q2 2024
                        </h4>
                        <p className="text-gray-600">
                          Expansion into new markets and enhancement of user
                          experience with personalized features.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center w-full md:w-1/4">
                    <div className="relative z-10 bg-blue-100 border border-gray-300 rounded-lg p-6 shadow-lg text-center h-[14rem] flex flex-col justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                          Q3 2024
                        </h4>
                        <p className="text-gray-600">
                          Integration of advanced analytics tools and
                          introduction of new reward categories.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex flex-col items-center w-full md:w-1/4">
                    <div className="relative z-10 bg-white border border-gray-300 rounded-lg p-6 shadow-lg text-center h-[14rem] flex flex-col justify-between ring-2 ring-white ring-offset-2 ring-offset-sky-200">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 mb-4">
                          Q4 2024
                        </h4>
                        <p className="text-gray-600">
                          Explore new technologies and expanding our platform's
                          capabilities.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
