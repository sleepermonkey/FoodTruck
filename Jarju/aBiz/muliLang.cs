using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoodTruck.aBiz
{
    public class muliLang
    {
        HttpContext context = HttpContext.Current;

        public string MSG1_ErrorUserName()
        {
            if ((string)context.Session["lang"] == "EN")
            {
                return "Please intput the user name";
            }
            else
            {
                return "กรุณากรอก user name ";
            }
        }

        public string MSG2_ErrorPassword()
        {
          
            if ((string)context.Session["lang"] == "EN")
            {
                return "Please intput the password";
            }
            else
            {
                return "กรุณากรอก password";
            }
        }


        public string MSG3_NoResult()
        {

            if ((string)context.Session["lang"] == "EN")
            {
                return "No data found for this searching";
            }
            else
            {
                return "ไม่พบรายการที่ค้นหา";
            }
        }

    }
}