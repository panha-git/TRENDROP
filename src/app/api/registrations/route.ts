export async function POST() {
  return Response.json(
    { error: "This registration endpoint has been retired. Please use /api/auth/register." },
    { status: 410 },
  );
}
