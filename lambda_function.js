import mysql from 'mysql2/promise'

const hostname = process.env.RDS_HOSTNAME;
const user_name = process.env.RDS_USERNAME;
const password = process.env.RDS_PASSWORD;
const databaseName = process.env.RDS_DB_NAME;

export const handler = async (event, context) => {
  // console.log('event:', JSON.stringify(event, null, 2));

  const connection = await mysql.createConnection({
    host: hostname,
    user: user_name,
    password: password,
    database: databaseName,
  });

  const post = event.queryStringParameters.post;

  var rec;

  try {
    //await connection.beginTransaction();
    
    const rec= await connection.execute("select * from ordering where post like '%" + post + "%';" );

    console.log(rec[0]);
  
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        },
        'body': JSON.stringify(rec[0])
    }
    //await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.log(error.message);
    throw error;
  } finally {
    connection.end();
  }
  

};
