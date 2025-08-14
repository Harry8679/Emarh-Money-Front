import React from 'react'
import DefaultLayout from '../components/DefaultLayout';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Home = () => {
  return (
    <DefaultLayout>
        <h1>This is Home Page</h1>
        <DotLottieReact
          src="https://lottie.host/a21018f6-3796-418a-b092-f6bff4f6ca3c/0ZyAvxJTlv.lottie"
          loop
          autoplay
        />
    </DefaultLayout>
  )
}

export default Home;