"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";
import Link from "next/link";
import {useEffect} from 'react';
import useAuth from '@/app/hooks/useAuth';
import CardHolder from "@/app/components/ui/CardHolder";

export default function DashBoard() {
    const authCtx = useAuth();

    return(
        <>
        <DefaultLayout>
        <div className="grid grid-flow-row">

          <div className="mt-2">
          <CardHolder title={`${authCtx.displayName}`}>
                <p>Welcome</p>
          </CardHolder>
          </div>
        </div>
        </DefaultLayout>
        </>
    )


}