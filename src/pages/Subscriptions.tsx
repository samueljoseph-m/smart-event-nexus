
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const mockSubscriptionPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    description: 'Essential event management for individuals and small teams',
    features: [
      'Up to 3 events at a time',
      'Basic task assignment',
      'Up to 10 team members',
      'Limited reporting',
    ],
    isPopular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    description: 'Advanced features for growing organizations',
    features: [
      'Unlimited events',
      'Smart task assignment',
      'Unlimited team members',
      'Guest list management',
      'Email reminders',
      'Basic customization',
      'Priority support',
    ],
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    description: 'Complete solution for large organizations',
    features: [
      'Everything in Premium',
      'Advanced customization',
      'White labeling',
      'API access',
      'Multiple departments',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    isPopular: false,
  },
];

// For demo purposes, we'll show a modal for payment
const PaymentModal = ({ 
  isOpen, 
  onClose, 
  plan 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  plan?: typeof mockSubscriptionPlans[0] 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !plan) return null;

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Subscription Updated",
        description: `You are now subscribed to the ${plan.name} plan!`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Subscribe to {plan.name}</h2>
        <p className="mb-6 text-gray-600">
          You're about to subscribe to the {plan.name} plan at ${plan.price}/month.
        </p>
        
        <div className="p-4 bg-gray-50 rounded-md mb-6">
          <p className="text-sm text-gray-600">This is a demonstration of the payment flow. In a real application, you would be redirected to Stripe for secure payment processing.</p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleProcessPayment} disabled={isProcessing}>
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `Subscribe for $${plan.price}/month`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Subscriptions = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<typeof mockSubscriptionPlans[0] | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const handleSelectPlan = (plan: typeof mockSubscriptionPlans[0]) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const currentPlan = user?.isPremium ? 'premium' : 'basic';

  return (
    <Layout>
      <div>
        <div className="page-header">
          <h1 className="page-title">Subscriptions</h1>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Choose the right plan for your organization's needs. Upgrade anytime as your team grows.
          </p>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  {user?.isPremium ? 'Premium Plan' : 'Basic Plan'}
                </h3>
                <p className="text-gray-500">
                  {user?.isPremium 
                    ? 'Your premium subscription is active' 
                    : 'You are currently on the free plan'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${user?.isPremium ? '29' : '0'}<span className="text-sm font-normal text-gray-500">/month</span>
                </p>
                {user?.isPremium && (
                  <p className="text-sm text-gray-500">Renews on June 1, 2024</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-gray-50">
            {user?.isPremium ? (
              <Button variant="outline">Manage Subscription</Button>
            ) : (
              <div className="text-sm text-gray-600">
                Upgrade to a premium plan to access more features
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mockSubscriptionPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.isPopular ? 'border-purple-500 shadow-md' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 -mt-2 mr-4">
                  <span className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full uppercase">Popular</span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="mr-2 mt-1">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === plan.id ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    variant={plan.isPopular ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade, downgrade, or cancel your subscription at any time.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">How does billing work?</h3>
              <p className="text-gray-600">We bill monthly or annually, depending on your preference. All plans are auto-renewed until canceled.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans come with a 14-day free trial. No credit card required for the Basic plan.</p>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          plan={selectedPlan || undefined} 
        />
      </div>
    </Layout>
  );
};

export default Subscriptions;
