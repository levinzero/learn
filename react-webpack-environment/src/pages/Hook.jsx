import React, { useState, useCallback, useMemo, memo } from 'react';
const MemoExpensive = memo(Expensive)
export default function() {
  const [dataA, setDataA] = useState(0);
  const [dataB, setDataB] = useState(0);
  const onClickA = () => {
    setDataA(o => o + 1);
  }
  const onClickB = useCallback(() => {
    setDataB(o => o + 2);
  }, [])
  const html =  <>
    <Cheap onClick={onClickA} name={`组件Cheap：${dataA}`}/>
    <MemoExpensive onClick={onClickB} name={`组件Expensive：${dataB}`} />
  </>;
  return html;
}

function Cheap({onClick, name}) {
  console.log('Cheap 被渲染');
  const html = <div onClick={onClick}>{name}</div>;
  return html;
}

const item = [1,2,3,4,5,6,7];

function Expensive({onClick, name}) {
  console.log('Expensive 被渲染');
  const value = useMemo(() => item.reduce((pre, cur) => {
    console.log('here will be called');
    return pre + cur
  }), []);
  const html = <>
    <div onClick={onClick}>{name}</div>
    <div>{value}</div>
  </>;
  return html;
}

