import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/Dialog';
import Button from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { IconMessage, IconPaperclip, IconX } from '@tabler/icons-react';
import { toast } from '@/components/ui/use-toast';
import { submitFeedback } from '@/services/api';
import type { FeedbackSubmissionRequest } from '@/types/api';

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'idea' | 'question' | 'problem';

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [type, setType] = useState<FeedbackType>('idea');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5000000) { // 5MB limit
        toast({
          title: 'File Too Large',
          description: 'File size must be less than 5MB',
          variant: 'destructive'
        });
        setFile(null);
        setFileName('');
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Message Required',
        description: 'Please enter your feedback message',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const feedbackRequest: FeedbackSubmissionRequest = {
        type,
        message,
        ...(file && { file })
      };

      await submitFeedback(feedbackRequest);
      
      toast({
        title: 'Feedback Sent Successfully!',
        description: 'Thank you for your feedback. We appreciate your input.',
        variant: 'success'
      });
      resetForm();
      onClose();
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending your feedback. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setType('idea');
    setMessage('');
    setFile(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconMessage className="w-6 h-6 text-green-600" />
            Feedback
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-gray-600">
            Please tell us what you think. Any kind of feedback is highly appreciated.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Feedback Type Selection */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Feedback Type</Label>
              <div className="flex gap-3">
                {[
                  { value: 'idea', label: 'Idea' },
                  { value: 'question', label: 'Question' },
                  { value: 'problem', label: 'Problem' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setType(option.value as FeedbackType)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                      type === option.value
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Message Textarea */}
              <div className="lg:col-span-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Your Feedback
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your feedback in detail..."
                  rows={8}
                  className="mt-1"
                  required
                />
              </div>

              {/* File Attachment */}
              <div className="lg:col-span-2">
                <Label className="text-sm font-medium">Attach a file (optional)</Label>
                <div className="mt-1 flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileClick}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <IconPaperclip className="w-4 h-4" />
                    Choose File
                  </Button>
                  {fileName && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border">
                      <span className="text-sm text-gray-700 truncate max-w-xs">{fileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileName('');
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*/*"
                />
                <p className="text-xs text-gray-500 mt-2">Maximum file size: 5MB. Supported formats: All file types</p>
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter className="flex justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
                className="px-6 py-2"
              >
                Reset
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!message.trim() || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 px-8 py-2"
                >
                  {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
