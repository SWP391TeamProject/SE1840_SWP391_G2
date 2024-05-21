import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import { Link } from "react-router-dom";

export default function LandingPageCarousel() {
  return (
    <>
      <Carousel className="w-full flex justify-center content-center bg-red-600">
        <CarouselContent>
          <CarouselItem>
            <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
              <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                  <div>
                    <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                      Consign Your Jewelry
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Sell your rare and unique jewelry through our premier
                      online auction house.
                    </p>
                    <div className="space-x-4 mt-6">
                      <Link
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        to="#"
                      >
                        Consign an Item
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent>
                        <CarouselItem>
                          <img
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                            height="550"
                            src="https://lh3.googleusercontent.com/fife/ALs6j_F3dz6jIH0rz6Pm-4jiG8u16dYgsY-__So0VBq4PCBu--TKv8ob3oQsHl4mpZ96u_i7Iq1x-0iAf8FtwAwj2gBRGsonVOTjM744xjMv3ejLiEAG96rXMnwcROC1ixHUl8lChGmzs-GoQfUvwHbO1-OYAcEs6mIHMBoe0YgF9M-kt_Q6UiveYsb1AgEBB2rospKKZFMMuYWVnoh0oqaXE8W_RVxD9viYvoPPLAmOOvjbaMjLhAseT8Tnxupq51MZi_bJmd7G1r9KuKxrBsg_0Tamu0q9zbLyA52wtFBvyOUPj8BpqM_pWEzc_KRkpzAbcaFJTw2PasLscPWl_xqI1MNKMWR-0-G01nBabbieLPx9OaSpOHXPqfDii8gYUL2j5qn8uGgM2LuQ6FafiSRZgeDCaRizQY31tJ36RG1yAyHLlKr5xunAsDcsUTYmoi7kRhcQug5X97QlGupdyQu3hvwynOr6NXFfDqbIkJg43P2yP4s5FnLoOqaQBCNdJjrhjyitxCI2bSvQhkaxZI5ekQZ_Fgix2MGIuFqVSAzZ9Stj7USAbrL3RErWo_CehM3q1YPPjces0YntpRUv5GO1i_2AoqWYA9wkm-2ABxvoFqL2cLv_RvJM2QMJUXUGHftVPatA1lxipKmQRPn0qpSn9KrGQduxzK3LlvsbSpxNZ-Cx9ryZh6yUWJ-EO_qZCYahbZtiN8NBq0CpW_02ttXb9Z6BTwF_ZFpYUTYAgt-P0yT895tKS3Woux_bk2fC5gPYoLLO4X7qhHfgEeeRTi7YmENOHsNuEtTfsmu3d82YAKFAo6npPPAkh66LQ5b4ks5THSU1vD9T_w0sqYPgHA4bu5vbzEiDP-KPcp4njaEQpgKn3scFSdU4TQ_CGBitu4qv6xQS44ECKAEab3KGJRyriHAq5WiFhP2YSoUSS1QyIw-qIFYPSrDCBdgcjNm4PclD_qJQV6KtqzK9KihMb57fC4Zm7suG1t76p-ogEc-rrXGvMC6ZBv9j1a8_p5vwh-beFYbs-ix53tCywGqB_UTgrdeVWVZg1C4HaU-ZRhQik-r60YDiTEpjMHEU9xBROOI-bFzb-5J-18atytr1t1JN9fJJL88KeFLSR1kXoCAnhdwvbeG85lBZUUNi46lImV9GRheOXRWK2KioQJjFX5JTRpdTjtgrWWBh68gz1r4RdHd5AixTMQ9Qg_4UN0TzSHuO2C9JvXAsYHIl3CqVp1M=s512"
                            width="550"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        </CarouselItem>
                        <CarouselItem>
                          <img
                            alt="Hero"
                            className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                            height="550"
                            src="https://lh3.googleusercontent.com/fife/ALs6j_GkRgqk4hpdYW375B5B3NArk0NsY842ltWykgoFwBN-Co5iVZqVypZuP9XOsia0S0z1H9jVdw1O0EEJVd9C1jDNjf2vtdGFNBSsR6NLGCCI3tHjLtEyFZg1BJGWkdpxesrMf30dGw7gEijrGkA5KWFK6SNN5Bchc8IXg1peg761eF3sJI4FvgrqBMDuiV74J4YZzhR59t8zt-V4dhOn1yn08L65G-AbXH3OYjB__2e1UuB5rOOILd5_PE5J-qDfFUvKeU6UfkYxSabUNkUWmOC4FmXUm3OuYuSXZCsTeukOc4fvPaYzrRIR_whxS3IqYZ2_zh8tJxJ2X5FiO0HLi0qPzDwWsbCrOzsuLMa4qIkTnU-tZUbGr899LEfW9BSlBZT4yUvOoku1wRa57wtlxlJwe8zqZXoQMtI0EMO_R44fL3lAKRMLsN5IdLUGvTCyl3yVUZQWgG5SZmUgXSRJZ5X6RRTKJ66n9MKYTg2U1O2CMZHLg7xwyRr7ySHcAiKxkjwgQU5vO_nZ03IJnX__BqPvbWn9uKwOrowDs3uzNVs4qh7ecv_Jb2OOZf_aKZWgpPIFbxllyr5DgarPRd6rLl9uP2cV_z4L-ognG2DujKU-GodeP7_wt-RFFGoT06PGskwzWDVwUsLYErtdqYTh8IAdOoIROcLaANE4ry86_GeVNuNz1z8i6Zjabjw0Db2dvm4lbke3CmgvRNHnt9KiOhCFCk9ecr9lMjoTSYXZnmNVdKnxSORXiIf85QibNtg29OZQCHKCisM5tvKZWRIX3Hq43fAbrASGCexLTrXhDltT41Xz4TAgUiwSHWsV88HUH1oV1EUCJkWCigQBMT9JOUYvEJtoSJol_Pe4zdHFZ3yYOz0gzvWKE_J9CP7ysn6E19XtMvcIPZpRxcT6iK3UoUAgHnbkZfweUCw_XKUeH-2zr7fKPLkNA2n_6HujoxEn_w7oMSx80CcYWV4eI96sUnoIshhDCagb9lF9Aa0au2XtCh2NIrXaHspzWFX4vlW_A6VCQptZV2oQW4k5N9JUOsklp1c6_zbw5lfT5mMyUVEAReh7jh-zsJxGwJPQ_ihiY8jq2ZdZRfTpYYuzHpicsltmrLtGo7JIeyUEbElZPOs4blnArE54hmRb2xvTRw2-7o1pQ_vcE2dQXoxCJ3_LIIOzLr36_Coub81BerboNj1ReekO9VDDla-Tywkc0lzCA2xKgD0gptQx4_Vnt0Yb8BJabJYt5-Drkd1nALVuobDDr__u-QwovxlArW5oxOH87M8Uxtl7V0ar5lyeY8BE-1CDJsqckvL8ir3yKDRSEbLbj-qzdycE1eHHpYo5ZVECI0KcC1FOYidjhPnhZwMxhqCjP05L4R_jWEIzeHtlZf8ZNB2rf46Qhr0=s512"
                            width="550"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
          <CarouselItem>
            <section className="w-full pt-12 md:pt-24 lg:pt-32 border-y">
              <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                <div className="mx-auto grid max-w-[1300px] gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                  <div>
                    <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                      Participate in Our Exclusive Auctions
                    </h1>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                      Participate in our exclusive auctions and discover rare
                      and unique jewelry you won't find anywhere else.
                    </p>
                    <div className="space-x-4 mt-6">
                      <Link
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        to="#"
                      >
                        Participate in Auction
                      </Link>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      alt="Hero"
                      className="mx-auto aspect-video overflow-hidden rounded-xl object-bottom sm:w-full lg:aspect-square"
                      height="550"
                      src="https://lh3.googleusercontent.com/fife/ALs6j_E_SJGMv1fSeeg718Sw_iTNsHcCDgBMqRDVabb1HjaVnl6_0-acrIv6ZihRTB3KQldPmB4qq7ZeMRDpvbdb4NuJ_pmmjYPlPPX5Nwrpkr-8BCxN7ZRHM67C7xCsj8-rpI9iUBIq6j4Z1q0wuIOj6glXKl07_Yxy_EWv1WeM1UWrGZ08gzF87PanhhGtOQ7ElXTBF7Aaw0_E2njAXfDqNXtju1d4zynqumbSCBjrFLPTz6b-YNMOg238XJpsuPPACrNhIDK1oGfYeEOjaaFXP6gGMEQcdSB3lZlH4T1F9Fp36JTgTnZPSsYBrFMIHajqICw0CHswB6gYsHHU1doH6rCeb1X2eshpq6ltf9D_zI84x9Q9ev8gATsr3zvoMjhM-tuFgZE06MOQutxT-5wpOClecAVcyWrmZCixGi5P8Dnc3bgRwcHXyz8jFGWoeWQceyYiem98oT9jB1GfYk3fGl-i3qENyMcWwns1OXENkMutOz-TLUB_11RFfFraE5xKQH85mLB79s1aXpH2eBl6etxG0SfGY-MjcmAtCRC0K3WjSaLRHI6qEONgti176PaZydPqXAtLdmlKl1Blcw_scsUNngqA-UTzVwjZMrtxi5cbhHCrA6aK7Cc-Q7j0_x3zionvWphF7x3Rb9666apvm8xQe6XI1_eU_VFia0Nxrni5i44OoDU8BegyzQ2ru308mJQlAmncf5JwWAkgkiHfNv85HYGxvnK-6SxGowuHF1jmHATgtYftZ_aaV83N5VdyYVTCHrphmSI1npGkpbMyjFPYl-Kiady0JoBM9mhLXfTU1BmmadCQnINM1m8shg-DUvygAgF_5320fUXuaZTmPCCQWHOT8p8LTdbBeFGDwICwbBCsPTxfdMA23OssKvDVxVThcRq3kJSyS8msaDM4DTljIZhuAGeNN-bmgE1KZafG4eT6JXpTPi1S7V32yZAD9KQCvVvLrT81S6BYDxocZJn1ctJIzqSWl4EnOBQTTBvqaonF5AkSfaQc24q3lkXA4iM198x6BozleMWvsNVthQPsvbdnquyBEnS6p1Ow63WbRnUwPva8W28p72DHyEx48QWBfGgxCmgCRaf8jNtuNjMJPFCa4qDno6rB68bfixXitXo6AAombSADxdzPFfCSiQ0SlYiE6EVAhMQ_PfY02z9ahU_4__SENZ9Phtlec-vEM0ZehJML3oLQ4I4K7XJuisKcr5HlPthXw8tUNAi64mwDduZr3IJoyL4u67loqaFxKzFIQTVayMNOOai5LZYF3svRKMO_6BMFts-sTXFiDfJHy3VqBzjL4vHW17YHYeKu6lSqMEBXRkP4DV9uLmDs8le4dmnFUDkz-Fv3bFNZ7Mpeo67dxuafvahC0Estu1_xu7mlgQ82B-o=s512"
                      width="550"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  </div>
                </div>
              </div>
            </section>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </>
  );
}
