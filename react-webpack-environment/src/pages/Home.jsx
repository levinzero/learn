import React, { useState } from 'react';

export const Home = (props) => {
  const [name, setName] = useState('don');
  const [password, setPassword] = useState('donpassword');
  console.log(useState('don'));
  return (
    <React.Fragment>
      <input value={name} onChange={e => setName(e.target.value)}/>
      <input value={password} onChange={e => setPassword(e.target.value)}/>
    </React.Fragment>
  );
}