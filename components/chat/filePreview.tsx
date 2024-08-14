"use client"
import 'swiper/css';
import 'swiper/css/bundle'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/modal";
import {Navigation} from "swiper/modules"
import Image from 'next/image';

export default function FilePreview ({urls}: {urls: string[]}){

    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    return (
        <div>
            <div className="grid grid-cols-2" onClick={onOpen}>
                {urls.slice(0, 4).map((url, index) => (
                    <Image key={index} src={url} alt="Attached file" width={200} height={200} className="rounded-lg" />
                ))}
            </div>
            <Modal  isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
                <ModalContent className="h-[80%] p-8">
                    {(onClose) => (
                        <Swiper
                            slidesPerView={1}
                            className="w-full h-full"
                            modules={[Navigation]}
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