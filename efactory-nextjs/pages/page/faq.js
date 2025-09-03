import React from 'react'
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";
import WelcomeHeader from '@/components/common/WelcomeHeader';
import Breadcrumb from '@/components/common/Breadcrumb';
import { IconChevronDown } from '@tabler/icons-react';
import Link from 'next/link';

export default function Faq() {

    const breadcrumbItem = [
        {
            name: "More Pages",
        },
        {
            name: "FAQs",
        },
    ]

    const AccordionItem = ({ header, ...rest }) => (
        <Item
            className="card bg-card-color rounded-xl overflow-hidden mb-1 last:mb-0 border border-dashed border-border-color"
            {...rest}
            header={({ state: { isEnter } }) => (
                <>
                    {header}
                    <IconChevronDown className={`w-[20px] h-[20px] min-w-[20px] transition-transform duration-200 ease-out ${isEnter && "rotate-180"}`} />
                </>
            )}
            buttonProps={{ className: "text-left w-full flex items-center justify-between gap-4 md:p-6 p-4" }}
            contentProps={{
                className: "border-t transition-height duration-200 ease-out"
            }}
            panelProps={{ className: " md:p-6 p-4" }}
        />
    );

    return (
        <div className='md:px-6 sm:px-3 pt-4'>
            <div className='container-fluid'>
                <Breadcrumb breadcrumbItem={breadcrumbItem} />
                <WelcomeHeader income />
                <div className='grid md:grid-cols-[3fr_1fr] grid-cols-1 gap-6 items-start'>
                    <div>
                        <Accordion transition transitionTimeout={300} className='md:mb-6 mb-4'>
                            <AccordionItem header="What is the Genesis Simple FAQ plugin?" initialEntered>
                                <p className='mb-4'>
                                    3 wolf moon officia aute, non cupidatat skateboard dolor brunch. <span className="text-danger">Food truck quinoa nesciunt laborum eiusmod</span>. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
                                </p>
                                <ul className='mb-4 md:ps-8 ps-4 list-disc'>
                                    <li>vegan excepteur butcher vice lomo. Leggings occaecat craft beer</li>
                                    <li>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry</li>
                                    <li>Brunch 3 wolf moon tempor, sunt aliqua</li>
                                </ul>
                                <p>
                                    Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim <span className="underline">aesthetic synth nesciunt you probably</span> haven't heard of them accusamus labore sustainable VHS.
                                </p>
                            </AccordionItem>

                            <AccordionItem header="How does the Genesis Simple FAQ plugin?">
                                <p className='mb-4'>
                                    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                </p>
                                <div className="md:p-4 p-3 rounded-xl border border-dashed border-success bg-success-50 text-success">
                                    A simple primary alert—check it out!
                                </div>
                            </AccordionItem>

                            <AccordionItem header="Can i customize the design of my FAQ section?">
                                <p className='mb-4'>
                                    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                </p>
                                <figure>
                                    <blockquote className="text-[1.25rem] mb-1">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.
                                    </blockquote>
                                    <figcaption className="text-font-color-100 small">
                                        - Someone famous in <cite title="Source Title">Source Title</cite>
                                    </figcaption>
                                </figure>
                            </AccordionItem>

                            <AccordionItem header="Where can i show the FAQ section on my website?">
                                <p className='mb-4'>
                                    Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.
                                </p>
                                <div className="md:p-4 p-3 rounded-xl border border-dashed border-black bg-black-50 text-font-color">
                                    A simple primary alert—check it out!
                                </div>
                            </AccordionItem>
                        </Accordion>
                        <div className='card rounded-xl bg-card-color md:p-6 p-4 border border-dashed border-border-color'>
                            <h6 className='pb-2 mb-6 border-b border-border-color'>
                                Need a support?
                            </h6>
                            <div className='form-control mb-20'>
                                <label htmlFor='faqEmail' className='form-label'>
                                    Email address
                                </label>
                                <input type='faqEmail' id='faqEmail' placeholder='name@example.com' className='form-input' />
                            </div>
                            <div className="form-control mb-15 flex flex-col">
                                <label className='form-label'>Enter description</label>
                                <textarea className="form-textarea" placeholder="Leave a comment here" rows="3"></textarea>
                            </div>
                            <button className='btn btn-outline-primary'>
                                Send Support
                            </button>
                        </div>
                    </div>
                    <div className='md:sticky md:top-100'>
                        <h6 className='pb-2 mb-3 border-b border-border-color'>
                            Helpful Links
                        </h6>
                        <ul className='ps-6 list-disc'>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Global settings
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Headings
                                </Link>
                            </li>
                            <ul className='ps-6 list-[circle]'>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Customizing headings
                                    </Link>
                                </li>
                            </ul>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Display headings
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Lead
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Inline text elements
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Text utilities
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Abbreviations
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Blockquotes
                                </Link>
                            </li>
                            <ul className='ps-6 list-[circle]'>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Naming a source
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Alignment
                                    </Link>
                                </li>
                            </ul>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Lists
                                </Link>
                            </li>
                            <ul className='ps-6 list-[circle]'>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Unstyled
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Inline
                                    </Link>
                                </li>
                                <li>
                                    <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                        Description list alignment
                                    </Link>
                                </li>
                            </ul>
                            <li>
                                <Link href="#" className='text-primary transition-all hover:text-secondary'>
                                    Responsive font sizes
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
