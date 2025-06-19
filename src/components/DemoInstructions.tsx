import React from 'react';
import { Card } from './ui/card';
import { Package, XCircle, AlertCircle } from 'lucide-react';

const DemoInstructions = () => {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
          Try the Demo
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
              <Package className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Check Order Status</h4>
                <p className="text-sm text-gray-600 mb-2">Try these sample orders:</p>
                <div className="space-y-1 text-xs text-gray-500">
                  <div><code className="bg-gray-100 px-2 py-1 rounded">ORD-12345</code> - Shipped order</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">ORD-67890</code> - Processing order</div>
                  <div><code className="bg-gray-100 px-2 py-1 rounded">ORD-11111</code> - Delivered order</div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
              <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Cancel Orders</h4>
                <p className="text-sm text-gray-600 mb-2">Test cancellation with any order ID above</p>
                <div className="text-xs text-gray-500">
                  The assistant will guide you through the cancellation process and provide a return ID.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> This is a demonstration with mock data. In a real implementation, these would connect to actual order management systems.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DemoInstructions; 