using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace FoodTruck.aControl
{
	public class DBManager
	{

		public DataTable SqlQuery(String pSQL,String DBName)
		{
			DataTable dt = new DataTable();
			string mDBConnection;

			mDBConnection = "server=" + ConfigurationManager.AppSettings["DBServer"]
							+ ";database=" + DBName
							+ ";UID=" +  ConfigurationManager.AppSettings["DBUser"]
							+ ";password=" + ConfigurationManager.AppSettings["DBPassword"];

			using (SqlConnection conn = new SqlConnection(mDBConnection))
			{
				try
				{
					SqlCommand cmd = new SqlCommand(pSQL, conn);
					conn.Open();
                    cmd.CommandTimeout = 0;
                    SqlDataReader rdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
					dt.Load(rdr);
				}
				catch (SqlException ex)
				{
					// handle error
					throw (ex);
				}

				catch (Exception ex)
				{
					// handle error
					throw (ex);
				}

				finally
				{
					conn.Close();
				}
				return dt;
			}
		}

		public int SqlExecute(String pSQL, String DBName)
		{
			int rowEffect = 0;
			string mDBConnection;

			mDBConnection = "server=" + ConfigurationManager.AppSettings["DBServer"]
							+ ";database=" + DBName // ConfigurationManager.AppSettings["DBName"]
                            + ";UID=" + ConfigurationManager.AppSettings["DBUser"]
							+ ";password=" + ConfigurationManager.AppSettings["DBPassword"];
			using (SqlConnection conn = new SqlConnection(mDBConnection))
			{
				try
				{
					SqlCommand command = new SqlCommand(pSQL, conn);
					command.Connection.Open();
                    command.CommandTimeout = 0;
                    command.ExecuteNonQuery();
				}
				catch (SqlException ex)
				{
					// handle error
					throw (ex);
				}

				catch (Exception ex)
				{
					// handle error
					throw (ex);
				}

				finally
				{
					conn.Close();
				}
				return rowEffect;
			}
        }

        public int SqlExecuteScalar(String pSQL, String DBName)
        {
            int ID = 0;

            string mDBConnection;

            mDBConnection = "server=" + ConfigurationManager.AppSettings["DBServer"]
                            + ";database=" + DBName
                            + ";UID=" + ConfigurationManager.AppSettings["DBUser"]
                            + ";password=" + ConfigurationManager.AppSettings["DBPassword"];

            using (SqlConnection conn = new SqlConnection(mDBConnection))
            {
                try
                {
                    SqlCommand command = new SqlCommand(pSQL, conn);
                    command.Connection.Open();
                    command.CommandTimeout = 0;
                    ID = Convert.ToInt32(command.ExecuteScalar());

                }
                catch (SqlException ex)
                {
                    // handle error 
                    throw (ex);
                }

                catch (Exception ex)
                {
                    // handle error 
                    throw (ex);
                }

                finally
                {
                    conn.Close();

                }
                return ID;
            }
        }
    }
}
