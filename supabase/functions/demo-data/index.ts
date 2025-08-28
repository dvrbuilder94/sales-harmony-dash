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
    console.log('Generating demo data...');

    // Generate sample KPI data for demo
    const demoKPIs = {
      ventasNetas: 125000.50,
      comisionesTotales: 8750.25,
      discrepancias: 2350.75,
      totalPagos: 122649.75,
      ventasPendientes: 3700.50,
      discrepanciasPercentage: 1.88,
      channels: [
        {
          id: 'demo-amazon',
          name: 'Amazon',
          ventasNetas: 65000.25,
          comisionesTotales: 4550.15,
          discrepancias: 975.50
        },
        {
          id: 'demo-ebay',
          name: 'eBay',
          ventasNetas: 28500.75,
          comisionesTotales: 1995.25,
          discrepancias: 456.25
        },
        {
          id: 'demo-shopify',
          name: 'Shopify',
          ventasNetas: 31499.50,
          comisionesTotales: 2204.75,
          discrepancias: 919.00
        }
      ],
      recentActivity: [
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          action: 'CSV_UPLOAD',
          channel: 'Amazon',
          details: 'Uploaded sales_data_2024.csv: 150 records processed'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          action: 'REPORT_GENERATED',
          channel: 'All',
          details: 'Monthly audit report generated in PDF format'
        },
        {
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          action: 'DISCREPANCY_DETECTED',
          channel: 'eBay',
          details: 'High discrepancy detected in order EB-2024-001234'
        }
      ]
    };

    console.log('Demo data generated successfully');

    return new Response(
      JSON.stringify({
        success: true,
        data: demoKPIs,
        message: 'Demo data generated successfully',
        generatedAt: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Demo data generation error:', error);
    
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