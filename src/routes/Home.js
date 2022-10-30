import React, { useEffect, useState } from 'react'
import { db } from "../firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from '../components/Tweet';
import TweetFactory from '../components/TweetFactory';

function Home({userObj}) {
  // console.log(userObj);
  const [tweets, setTweets] = useState([]);

  /*
    const getTweets = async () => {
      const q = query(collection(db, "tweets"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        // setTweets(prev => [doc.data(), ...prev]);  // 최신 트윗을 가장 먼저 표시
        const tweetObject = {...doc.data(), id:doc.id}; // 기존 값에 id 추가
        setTweets(prev => [tweetObject, ...prev]);
      });
    }
  */

  useEffect(() => {   // 실시간으로 데이터베이스 문서 가져오기
    // getTweets();
    const q = query(
      collection(db, "tweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id});
      });
      // console.log(newArray);
      setTweets(newArray);
    });
  }, []);

  // console.log(tweets);

  return (
    <div className="container">
      <TweetFactory userObj={userObj} />
      <div style={{marginTop: 30}}>
        {tweets.map(tweet => (
          <Tweet
            key={tweet.id}
            tweetObj={tweet}
            isOwner={tweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  )
}

export default Home;