import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    // On peut réutiliser la même sécurité que pour l'entrée pour simplifier
    if (authHeader !== `Bearer ${process.env.N8N_WEBHOOK_SECRET}`) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { action_type, payload } = body;

    // URL du Webhook N8N dédié aux ACTIONS (à créer dans N8N)
    // On utilise une variable d'env pour pouvoir changer l'URL selon l'env
    const N8N_ACTION_WEBHOOK_URL = "https://n8n.srv1049957.hstgr.cloud/webhook/actions-dispatcher";

    const response = await fetch(N8N_ACTION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.N8N_WEBHOOK_SECRET}`
      },
      body: JSON.stringify({
        source: 'australehub_ui',
        action_type,
        payload,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) throw new Error('Échec de la communication avec N8N');

    return NextResponse.json({ success: true, message: 'Action transmise à N8N' });

  } catch (error: any) {
    console.error("Erreur Action API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}