"use client";
import DefaultLayout from "@/app/layout/DefaultLayout";

import Script from 'next/script';
import useAuth from '@/app/hooks/useAuth';
import { useEffect, useRef } from "react";

const url = process.env.NEXT_PUBLIC_API_URL;
export default function CalenderPage() {
    const authCtx = useAuth();

    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const parentDivRef = useRef<HTMLDivElement | null>(null);

    const adjustHeight = () => {
        if (
            iframeRef.current &&
            iframeRef.current.contentWindow &&
            parentDivRef.current
        ) {
            const iframeDocument = iframeRef.current.contentWindow.document;
            if (iframeDocument && iframeDocument.body) {
                // Get the scrollHeight of the iframe's content
                const contentHeight = iframeDocument.body.scrollHeight;
                parentDivRef.current.style.height = contentHeight + 'px';
            }
        }
    };

    useEffect(() => {
        // Ensure the iframeRef is defined
        const iframeElement = iframeRef.current;

        if (iframeElement) {
            // Add the load event listener to the iframe
            iframeElement.addEventListener('load', adjustHeight);
        }

        // Cleanup function to remove the event listener
        return () => {
            if (iframeElement) {
                iframeElement.removeEventListener('load', adjustHeight);
            }
        };
    }, []);
    
   

    return(
        
        <DefaultLayout>
        <div className="flex flex-col">

            <div className="mt-3 bg-[#fafafa] rounded-lg flex p-5" ref={parentDivRef}>

            <iframe src="https://api.leadconnectorhq.com/widget/booking/t7EKwlwP90TcR8YsAmys" 
            style={{width: "100%",border:"none",overflow:"hidden",height: '100%',minHeight: '1024px'}} 
            scrolling="no" id="t7EKwlwP90TcR8YsAmys_1729019873405"
            ref={iframeRef}
            onLoad={adjustHeight}
            />
             <Script
                src="https://link.msgsndr.com/js/form_embed.js"
                strategy="afterInteractive"// Adjust the loading strategy as needed
            />
          
            </div>


        </div>

        </DefaultLayout>

    )

}