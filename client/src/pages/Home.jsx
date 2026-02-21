import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedPosts from '../components/home/FeaturedPosts';
import CategoryCarousel from '../components/home/CategoryCarousel';
import RecentTimeline from '../components/home/RecentTimeline';
import StatsCounter from '../components/home/StatsCounter';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
  return (
    <>
      <Hero />
      <CategoryCarousel />
      <FeaturedPosts />
      <RecentTimeline />
      <StatsCounter />
      <Newsletter />
    </>
  );
};

export default Home;
