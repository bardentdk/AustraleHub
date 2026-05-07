import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action_type, payload } = body;

    // L'URL de ton webhook N8N Dispatcher
    const N8N_ACTION_WEBHOOK_URL = "https://n8n.srv1049957.hstgr.cloud/webhook/actions-dispatcher";

    // C'est le serveur qui ajoute le secret de manière totalement invisible pour le navigateur
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

    if (!response.ok) {
      throw new Error(`Échec de la communication avec N8N (Status: ${response.status})`);
    }

    return NextResponse.json({ success: true, message: 'Action transmise à N8N avec succès' });

  } catch (error: any) {
    console.error("Erreur Action API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}