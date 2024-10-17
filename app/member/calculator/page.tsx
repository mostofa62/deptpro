"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import { useState,useEffect, useRef, useCallback } from "react";
import axios from "axios";
import useAuth from '@/app/hooks/useAuth';


const url = process.env.NEXT_PUBLIC_API_URL;
export default function CalculatorPage() {

    return(
        
        <DefaultLayout>
        <div className="flex flex-col">

            <div className="mt-3 bg-[#fafafa] rounded-lg flex p-5"></div>


            </div>

            </DefaultLayout>

        )


}