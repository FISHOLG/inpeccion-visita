import React from 'react';
import {  Text, PressableProps, Pressable } from "react-native";



interface Props extends PressableProps
{
    className?: string;
    children:React.ReactNode
    color?:string
}



const ThemedButton = ({className,children,color="bg-light-primary dark:bg-dark-primary",...rest}:Props) => {
  return (
   <Pressable
   className={`${color} items-center rounded-lg px-6 py-3 active:opacity-80 ${className}`}
   {...rest}>
       <Text className={'text-white text-base lg:text-xl font-semibold'}>{children}</Text>
   </Pressable>
  );
};

export default ThemedButton;