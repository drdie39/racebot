import { getMonitor } from '@/src/core/state/singleton';

export async function GET() {
  const monitor = getMonitor();
  const stream = new ReadableStream({
    start(controller) {
      const send = () => controller.enqueue(`data: ${JSON.stringify(monitor.getState())}\n\n`);
      const onState = () => send();
      monitor.on('state', onState);
      send();
      return () => monitor.off('state', onState);
    }
  });

  return new Response(stream, {
    headers: {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache'
    }
  });
}
