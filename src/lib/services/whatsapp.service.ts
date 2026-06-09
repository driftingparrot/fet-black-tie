export async function dispatchTicketWhatsApp(params: {
  phoneNumber: string;
  buyerName: string;
  tier: string;
  qrSlug: string;
}): Promise<void> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/confirmation`;
  // eslint-disable-next-line no-console
  console.log(`[WhatsApp] Ticket dispatch to ${params.phoneNumber}: ${url}`);
}
