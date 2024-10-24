"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';
import HolderOne from "@/app/layout/HolderOne";


const url = process.env.NEXT_PUBLIC_API_URL;
export default function TrainingPage() {

    return(
        
        <DefaultLayout>
        <div className="flex flex-col">

        <HolderOne
            title="training"            
            linkItems={[
            //   {
            //     link:'/',
            //     title:''
            //   },              
            ]}
            />

            <div className="mt-3 bg-[#fafafa] rounded-lg flex p-5"></div>


            </div>

            </DefaultLayout>

        )


}