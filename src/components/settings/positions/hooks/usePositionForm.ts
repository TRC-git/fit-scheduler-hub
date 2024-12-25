import { useState, useEffect } from "react";
import { Position, FormData } from "../types";

export const usePositionForm = (position?: Position) => {
  const [formData, setFormData] = useState<FormData>({
    positionname: '',
    paytype: '',
    defaultpayrate: '',
    description: '',
    required_certifications: '',
    min_experience_months: ''
  });

  useEffect(() => {
    if (position) {
      setFormData({
        positionname: position.positionname || '',
        paytype: position.paytype || '',
        defaultpayrate: position.defaultpayrate?.toString() || '',
        description: position.description || '',
        required_certifications: position.required_certifications?.join(', ') || '',
        min_experience_months: position.min_experience_months?.toString() || ''
      });
    }
  }, [position]);

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const prepareSubmissionData = (): Position => {
    const certifications = formData.required_certifications
      ? formData.required_certifications.split(',').map(cert => cert.trim())
      : [];

    const submissionData: Position = {
      positionname: formData.positionname,
      paytype: formData.paytype || null,
      defaultpayrate: formData.defaultpayrate ? Number(formData.defaultpayrate) : null,
      description: formData.description || null,
      required_certifications: certifications,
      min_experience_months: formData.min_experience_months ? Number(formData.min_experience_months) : 0
    };

    if (position?.positionid) {
      submissionData.positionid = position.positionid;
    }

    return submissionData;
  };

  return {
    formData,
    handleFormChange,
    prepareSubmissionData
  };
};