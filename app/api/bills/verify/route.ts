import { NextRequest, NextResponse } from 'next/server'
import { getPaymentGatewayService } from '@/lib/bills/payment-gateway'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get('reference')
    const gateway = (searchParams.get('gateway') || 'paystack') as 'paystack' | 'flutterwave'

    if (!reference) {
      return NextResponse.json(
        { error: 'Payment reference is required' },
        { status: 400 }
      )
    }

    const paymentService = getPaymentGatewayService(gateway)
    const verification = await paymentService.verifyPayment(reference)

    if (verification.success) {
      // Here you would typically:
      // 1. Update your database with the transaction
      // 2. Trigger the actual bill payment to the biller
      // 3. Send confirmation email/SMS to customer
      
      return NextResponse.json({
        success: true,
        status: verification.status,
        reference: verification.reference,
        amount: verification.amount,
        currency: verification.currency,
        paidAt: verification.paidAt,
        gatewayReference: verification.gatewayReference,
      })
    }

    return NextResponse.json({
      success: false,
      status: verification.status,
      reference: verification.reference,
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
