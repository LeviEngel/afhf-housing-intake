
import React from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
// Assuming these are your imported UI components and types
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

// Define a simplified type structure based on the section's fields
type CriminalCharge = {
    id: string; // useFieldArray requires an ID
    personName: string;
    charge: string;
    dateOfOffense: string;
    outcome: string;
    areTheyOnProbation: 'Yes' | 'No';
    probationOfficer: string;
    lengthOfProbation: string;
    startDate: string;
    endDate: string;
};

type CriminalHistoryFormData = {
    hasCriminalOffense: 'Yes' | 'No';
    charges: CriminalCharge[];
    isWillingToBackgroundCheck: 'Yes' | 'No';
};

// Placeholder Type for Application Data (replacing the removed import)
type IntakeApplicationDataPlaceholder = {
    hasCriminalOffense?: 'Yes' | 'No';
    charges?: CriminalCharge[];
    isWillingToBackgroundCheck?: 'Yes' | 'No';
    // Add other relevant top-level application fields here if needed by other sections
};


interface CriminalHistoryProps {
    // Replaced IntakeApplicationData with the placeholder type
    data: IntakeApplicationDataPlaceholder; // Full app data object
    updateData: (data: Partial<IntakeApplicationDataPlaceholder>) => void;
    nextStep: () => void;
    prevStep: () => void;
}

const StepCriminalHistory: React.FC<CriminalHistoryProps> = ({ data, updateData, nextStep, prevStep }) => {
    
    // We are deliberately NOT using the Zod resolver here
    const form = useForm<CriminalHistoryFormData>({
        defaultValues: {
            // Retrieve and set initial values from the main application data
            hasCriminalOffense: data?.hasCriminalOffense || 'No',
            // Cast to 'any' to temporarily work with the 'charges' array before full data model refactor
            charges: (data as any)?.charges || [], 
            isWillingToBackgroundCheck: data?.isWillingToBackgroundCheck || 'No',
        },
        mode: 'onBlur',
    });

    // Destructure RHF hooks
    const { register, control, watch, formState: { errors } } = form;
    
    // Hook for handling the dynamic list of charges
    const { fields, append, remove } = useFieldArray({
        control,
        name: "charges",
    });

    // Watchers for conditional rendering
    const hasCriminalOffense = watch('hasCriminalOffense');
    
    const onSubmit: SubmitHandler<CriminalHistoryFormData> = (currentStepData) => {
        
        // Manual Validation Check (Senior Dev: If you omit Zod, you must implement critical checks here)
        if (currentStepData.hasCriminalOffense === 'Yes' && currentStepData.charges.length === 0) {
            alert('Please click "+ Add Offense" to detail the criminal charges.');
            return;
        }

        // Map the validated data back to the parent state and proceed
        updateData(currentStepData); 
        nextStep();
    };

    // Template for a new, empty charge entry
    const initialCharge: Omit<CriminalCharge, 'id'> = {
        personName: '', charge: '', dateOfOffense: '', outcome: '',
        areTheyOnProbation: 'No', probationOfficer: '', lengthOfProbation: '',
        startDate: '', endDate: ''
    };

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Criminal History</CardTitle>
                <CardDescription>
                    Please provide details for any criminal offense charged against you or any household member.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="criminal-history-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        {/* 1. HAS CRIMINAL OFFENSE RADIO GROUP */}
                        <Field className="space-y-3">
                            <FieldLabel>
                                Have you or any other member of your household been charged with a criminal offense?:
                            </FieldLabel>
                            <RadioGroup
                                // Custom onChange handler to update RHF state directly
                                onValueChange={(value: 'Yes' | 'No') => form.setValue('hasCriminalOffense', value, { shouldValidate: true })}
                                defaultValue={form.watch('hasCriminalOffense')}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="offense-yes" />
                                    <FieldLabel htmlFor="offense-yes">Yes</FieldLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="offense-no" />
                                    <FieldLabel htmlFor="offense-no">No</FieldLabel>
                                </div>
                            </RadioGroup>
                            {/* Error messaging for the main radio group */}
                            {errors.hasCriminalOffense && <FieldError errors={[{ message: errors.hasCriminalOffense.message }]} />}
                        </Field>

                        {/* 2. CONDITIONAL/DYNAMIC CHARGE FIELDS */}
                        {hasCriminalOffense === 'Yes' && (
                            <div className="space-y-4 pt-4 border-t mt-4">
                                <h3 className="text-lg font-semibold">Offense Details</h3>
                                
                                {fields.map((field, index) => {
                                    // Watch probation status for conditional display within the repeatable block
                                    const chargeProbation = form.watch(`charges.${index}.areTheyOnProbation`);

                                    return (
                                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                            <h4 className="font-medium text-sm">Charge #{index + 1}</h4>
                                            
                                            {/* PERSON NAME FIELD */}
                                            <Field>
                                                <FieldLabel htmlFor={`charge-name-${index}`}>Person Name</FieldLabel>
                                                <Input {...register(`charges.${index}.personName`, { required: 'Person Name is required.' })} id={`charge-name-${index}`} placeholder="e.g., Jane Doe" />
                                                {errors.charges?.[index]?.personName && <FieldError errors={[{ message: errors.charges[index]?.personName?.message }]} />}
                                            </Field>
                                            
                                            {/* CHARGE FIELD */}
                                            <Field>
                                                <FieldLabel htmlFor={`charge-desc-${index}`}>Charge</FieldLabel>
                                                <Input {...register(`charges.${index}.charge`, { required: 'Charge is required.' })} id={`charge-desc-${index}`} placeholder="e.g., Misdemeanor Theft" />
                                                {errors.charges?.[index]?.charge && <FieldError errors={[{ message: errors.charges[index]?.charge?.message }]} />}
                                            </Field>

                                            {/* DATE OF OFFENSE */}
                                            <Field>
                                                <FieldLabel htmlFor={`charge-date-${index}`}>Date Of Offense</FieldLabel>
                                                <Input type="date" {...register(`charges.${index}.dateOfOffense`)} id={`charge-date-${index}`} />
                                            </Field>

                                            {/* OUTCOME FIELD */}
                                            <Field>
                                                <FieldLabel htmlFor={`charge-outcome-${index}`}>Outcome</FieldLabel>
                                                <Input {...register(`charges.${index}.outcome`, { required: 'Outcome is required.' })} id={`charge-outcome-${index}`} />
                                                {errors.charges?.[index]?.outcome && <FieldError errors={[{ message: errors.charges[index]?.outcome?.message }]} />}
                                            </Field>

                                            {/* ARE THEY ON PROBATION? RADIO */}
                                            <Field className="space-y-3">
                                                <FieldLabel>Are They On Probation?</FieldLabel>
                                                <RadioGroup
                                                    onValueChange={(value: 'Yes' | 'No') => form.setValue(`charges.${index}.areTheyOnProbation`, value)}
                                                    defaultValue={form.watch(`charges.${index}.areTheyOnProbation`)}
                                                    className="flex space-x-4"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="Yes" id={`prob-yes-${index}`} />
                                                        <FieldLabel htmlFor={`prob-yes-${index}`}>Yes</FieldLabel>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="No" id={`prob-no-${index}`} />
                                                        <FieldLabel htmlFor={`prob-no-${index}`}>No</FieldLabel>
                                                    </div>
                                                </RadioGroup>
                                            </Field>
                                            
                                            {/* NESTED CONDITIONAL FIELDS (Probation Details) */}
                                            {chargeProbation === 'Yes' && (
                                                <div className="probation-details space-y-4 p-3 border-l-2 border-indigo-500">
                                                    <Field>
                                                        <FieldLabel htmlFor={`prob-officer-${index}`}>Probation Officer</FieldLabel>
                                                        <Input {...register(`charges.${index}.probationOfficer`, { required: 'Probation Officer is required.' })} id={`prob-officer-${index}`} placeholder="Officer Name" />
                                                        {errors.charges?.[index]?.probationOfficer && <FieldError errors={[{ message: errors.charges[index]?.probationOfficer?.message }]} />}
                                                    </Field>
                                                    
                                                    <Field>
                                                        <FieldLabel htmlFor={`prob-length-${index}`}>Length of Probation</FieldLabel>
                                                        <Input {...register(`charges.${index}.lengthOfProbation`)} id={`prob-length-${index}`} />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor={`prob-start-${index}`}>Start Date</FieldLabel>
                                                        <Input type="date" {...register(`charges.${index}.startDate`)} id={`prob-start-${index}`} />
                                                    </Field>
                                                    <Field>
                                                        <FieldLabel htmlFor={`prob-end-${index}`}>End Date</FieldLabel>
                                                        <Input type="date" {...register(`charges.${index}.endDate`)} id={`prob-end-${index}`} />
                                                    </Field>
                                                </div>
                                            )}
                                            
                                            <Button 
                                                type="button" 
                                                variant="destructive" 
                                                onClick={() => remove(index)}
                                                className="w-full mt-2"
                                            >
                                                Remove Charge #{index + 1}
                                            </Button>
                                        </div>
                                    );
                                })}

                                <Button type="button" variant="outline" onClick={() => append(initialCharge as CriminalCharge)}>
                                    + Add Offense
                                </Button>
                                
                                {/* User feedback when no charges are entered */}
                                {hasCriminalOffense === 'Yes' && fields.length === 0 && (
                                    <p className="text-red-500 text-sm mt-2">
                                        ⚠️ You indicated 'Yes' to charges. Please detail the offense(s) by clicking "+ Add Offense."
                                    </p>
                                )}
                            </div>
                        )}
                        
                        {/* 3. BACKGROUND CHECK RADIO GROUP */}
                        <Field className="space-y-3 pt-4 border-t mt-4">
                            <FieldLabel>
                                **Would you and all adult members of your household be willing to submit to a criminal background check?**
                            </FieldLabel>
                            <RadioGroup
                                onValueChange={(value: 'Yes' | 'No') => form.setValue('isWillingToBackgroundCheck', value)}
                                defaultValue={form.watch('isWillingToBackgroundCheck')}
                                className="flex space-x-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Yes" id="bg-yes" />
                                    <FieldLabel htmlFor="bg-yes">Yes</FieldLabel>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="No" id="bg-no" />
                                    <FieldLabel htmlFor="bg-no">No</FieldLabel>
                                </div>
                            </RadioGroup>
                            {errors.isWillingToBackgroundCheck && <FieldError errors={[{ message: errors.isWillingToBackgroundCheck.message }]} />}
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
            
        </Card>
    );
};

export default StepCriminalHistory;