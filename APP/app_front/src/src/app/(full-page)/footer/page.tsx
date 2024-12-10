'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext } from 'react';
import Link from 'next/link';

import { LayoutContext } from '@/src/layout/context/layoutcontext';

const Footer = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const currentYear = new Date().getFullYear();

    return (
        <div className="surface-0 flex justify-content-center">
            <div id="home" className="landing-wrapper overflow-hidden">
                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-8 lg:px-8 flex align-items-center justify-content-between relative lg:static">
                    <div className="grid justify-content-between">
                        <div className="col-12 md:col-2 lg:col-3">
                            <Link href="/" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer">
                                <img src={`/layout/images/prosy.png`} alt="footer sections" width="50" height="50" className="mr-2" />
                                <span className="font-medium text-2xl line-height-3 mb-3 text-900">PROSY</span>
                            </Link>
                        </div>
                        <div className="col-12 md:col-10 lg:col-9">
                            <div className="grid text-center md:text-left">
                                <div className="col-12 md:col-5">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Entreprise</h4>
                                    <Link href="/company/about-us" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        À propos de nous
                                    </Link>
                                    <Link href="/company/contact" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Contact
                                    </Link>
                                    <Link href="/company/news" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Actualités
                                    </Link>
                                </div>
                                <div className="col-12 md:col-7 mt-4 md:mt-0">
                                    <h4 className="font-medium text-2xl line-height-3 mb-3 text-900">Mentions légales</h4>
                                    <Link href="/legal/cookie-policy" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Politique des cookies
                                    </Link>
                                    <Link href="/legal/brand-policy" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Politique de marque
                                    </Link>
                                    <Link href="/legal/privacy-policy" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Politique de confidentialité
                                    </Link>
                                    <Link href="/legal/rgpd" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        RGPD
                                    </Link>
                                    <Link href="/legal/terms-of-service" className="flex flex-wrap align-items-center justify-content-center md:justify-content-start md:mb-0 mb-3 cursor-pointer line-height-3 text-xl block mb-2 text-700">
                                        Conditions d'utilisation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="py-3 text-center">
                    <p className="text-sm text-700">
                        © 2023 - {currentYear} Prosy. Tous droits réservés. 
                    </p>
                    <p className="text-sm text-700">
                        Hébergé avec ❤️ par <a href="https://www.santia-tech.com" className="text-primary">Santia-Tech</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
