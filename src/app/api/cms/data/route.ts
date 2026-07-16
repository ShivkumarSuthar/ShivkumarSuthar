import { NextResponse } from 'next/server';
import { getDb, loadFromLocalFile, saveToLocalFile } from '../../../../lib/db';

export async function GET() {
  try {
    const db = await getDb();
    if (db) {
      const collection = db.collection('cms_data');
      const doc = await collection.findOne({ userId: 'default-user' });
      if (doc && doc.cmsData) {
        console.log('Successfully retrieved CMS data from MongoDB');
        return NextResponse.json(doc.cmsData);
      }
    }
    
    const fileData = loadFromLocalFile();
    if (fileData) {
      return NextResponse.json(fileData);
    }

    return NextResponse.json(null);
  } catch (error: any) {
    console.error('Error fetching CMS data from database:', error);
    return NextResponse.json({ error: 'Failed to retrieve CMS data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cmsData } = body;
    if (!cmsData) {
      return NextResponse.json({ error: 'Missing cmsData in request body' }, { status: 400 });
    }

    saveToLocalFile(cmsData);

    let savedToMongo = false;
    const db = await getDb();
    if (db) {
      const collection = db.collection('cms_data');
      await collection.updateOne(
        { userId: 'default-user' },
        { $set: { userId: 'default-user', cmsData, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log('Successfully saved CMS data to MongoDB');
      savedToMongo = true;
    }

    return NextResponse.json({
      success: true,
      persisted: savedToMongo ? 'mongodb' : 'local_file_only'
    });
  } catch (error: any) {
    console.error('Error saving CMS data to database:', error);
    return NextResponse.json({ error: 'Failed to save CMS data: ' + error.message }, { status: 500 });
  }
}
