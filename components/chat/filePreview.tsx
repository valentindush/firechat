"use client"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Modal, ModalContent, useDisclosure } from "@nextui-org/modal";
import { Navigation } from 'swiper/modules';
import Image from 'next/image';

export default function FilePreview ({urls}: {urls: string[]}){

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div>
            {urls.length > 1 && <p className='text-xs font-light pb-2'>({urls.length})</p>}
            <div className="grid grid-cols-2 gap-2" onClick={onOpen}>
                {urls.slice(0, 4).map((url, index) => (
                    <Image key={index} src={url} alt="Attached file" width={200} height={200} className="rounded-lg" />
                ))}
            </div>
            <Modal  isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent className="h-[80%] p-8">
                    {(onClose) => (
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={50}
                            className="w-full h-full"
                            modules={[Navigation]}
                            navigation
                        >
                            {urls.map((url, index) => (
                                <SwiperSlide key={index}>
                                    <Image src={url} alt="Attached file" layout="fill" objectFit="cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}