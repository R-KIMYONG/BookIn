import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('SearchKeyWord') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? '1')); // 1-based
    const limitRaw = Number(searchParams.get('limit') ?? '20');
    const limit = Math.min(Math.max(1, limitRaw), 50);    

  if (!keyword) {
    return NextResponse.json({ items: [], total: 0 }, { status: 200 });
  }

   const apiUrl =
      `http://www.aladin.co.kr/ttb/api/ItemSearch.aspx` +
      `?ttbkey=${process.env.NEXT_PUBLIC_ALADIN_TTB_KEY}` +
      `&Query=${encodeURIComponent(keyword)}` +
      `&QueryType=Keyword` +            
      `&MaxResults=${limit}` +
      `&start=${page}` +
      `&Sort=Accuracy` +               
      `&SearchTarget=Book` +
      `&output=js` +
      `&Version=20131101`;


   try {
    const response = await fetch(apiUrl,{ cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json({ error: 'Aladin upstream error' }, { status: 502 });
    }
    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}