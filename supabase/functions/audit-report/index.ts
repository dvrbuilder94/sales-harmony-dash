import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { format, logs } = await req.json();

    console.log(`Generating audit report in ${format} format for ${logs.length} logs`);

    if (format === 'csv') {
      // Generate CSV content
      const csvHeaders = 'Timestamp,Action,Channel,Details\n';
      const csvRows = logs.map((log: any) => {
        const timestamp = new Date(log.timestamp).toLocaleString('es-ES');
        const action = log.action || '';
        const channel = log.channel?.name || '';
        const details = (log.details || '').replace(/"/g, '""'); // Escape quotes
        
        return `"${timestamp}","${action}","${channel}","${details}"`;
      }).join('\n');

      const csvContent = csvHeaders + csvRows;

      return new Response(
        JSON.stringify({
          success: true,
          content: csvContent,
          filename: `audit-report-${new Date().toISOString().split('T')[0]}.csv`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else if (format === 'pdf') {
      // For PDF, we'll generate a simple HTML-like content that can be converted to PDF
      // In a real implementation, you might want to use a PDF generation library
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Audit Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .timestamp { font-family: monospace; }
          </style>
        </head>
        <body>
          <h1>Audit Report</h1>
          <p>Generated on: ${new Date().toLocaleString('es-ES')}</p>
          <p>Total logs: ${logs.length}</p>
          
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action</th>
                <th>Channel</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${logs.map((log: any) => `
                <tr>
                  <td class="timestamp">${new Date(log.timestamp).toLocaleString('es-ES')}</td>
                  <td>${log.action || ''}</td>
                  <td>${log.channel?.name || ''}</td>
                  <td>${log.details || ''}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `;

      return new Response(
        JSON.stringify({
          success: true,
          content: htmlContent,
          filename: `audit-report-${new Date().toISOString().split('T')[0]}.pdf`,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } else {
      throw new Error('Unsupported format. Use "csv" or "pdf".');
    }
  } catch (error) {
    console.error('Audit report error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Unknown error occurred',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});