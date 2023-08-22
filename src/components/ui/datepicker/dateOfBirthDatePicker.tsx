/**
/DOBPicker.tsx
**/

'use client';

import * as React from 'react';
import { format, subYears } from 'date-fns';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { buttonVariants } from '@/components/ui/button';
import { id } from 'date-fns/locale'


import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DOBPicker({ dob, setDOB, className }: { dob: Date | undefined; setDOB: React.Dispatch<React.SetStateAction<Date | undefined>>, className?: string }) {
    /**
     * The maximum date that can be selected is 0 years ago
     */
    const maxDate = subYears(new Date(), 0);

    return (
        <div className={cn("w-full", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'w-full justify-start text-left font-normal bg-white text-gray-800',
                            !dob && 'text-gray-500'
                        )}
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M4.75 8.75C4.75 7.64543 5.64543 6.75 6.75 6.75H17.25C18.3546 6.75 19.25 7.64543 19.25 8.75V17.25C19.25 18.3546 18.3546 19.25 17.25 19.25H6.75C5.64543 19.25 4.75 18.3546 4.75 17.25V8.75Z"
                            ></path>
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M8 4.75V8.25"
                            ></path>
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M16 4.75V8.25"
                            ></path>
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M7.75 10.75H16.25"
                            ></path>
                        </svg>

                        {dob ? format(dob, 'PPP', {
                            locale: id
                        }) : <span>Pilih Tanggal Lahir</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0  text-gray-800 bg-white border border-gray-200">
                    <Calendar
                        classNames={{
                            cell:
                                'text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                            day: cn(
                                buttonVariants({ variant: 'ghost' }),
                                'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gray-200 hover:text-gray-800'
                            ),
                            day_selected: 'rounded-full bg-languid-lavendar hover:bg-gray-200 text-secondary-foreground',
                            caption_label: 'hidden',
                            caption_dropdowns: 'flex w-full items-center justify-center space-x-2',
                        }}
                        mode="single"
                        selected={dob}
                        fromDate={subYears(new Date(), 100)}
                        toDate={maxDate}
                        captionLayout="dropdown"
                        onSelect={setDOB}
                        defaultMonth={new Date(dob?.getFullYear() ?? maxDate.getFullYear(), dob?.getMonth() ?? maxDate.getMonth(), 1)}
                        required
                        initialFocus
                        className="border rounded-md border-gray-200"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default DOBPicker;
