using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Web;

namespace FoodTruck.aBiz
{
    public static class ismoUtil
    {

        public static Boolean  CheckSpecialCharacter(string pText)
        {
            byte[] asciiByte = Encoding.ASCII.GetBytes(pText);
            foreach (byte X in asciiByte)
            {
                if (X < 48)
                {
                    return false;
                }
                else if (X > 57 && X < 65)
                {
                    return false;
                }
                else if (X > 90 && X < 97)
                {
                    return false;
                }
                else if (X > 122)
                {
                    return false;
                }
            }
            return true;
        }

        public static string ConvertAngularDateTo120(string pDateString)
        {
            DateTime dDateValue;

            dDateValue = DateTime.ParseExact(pDateString.Substring(0, 24), "ddd MMM d yyyy HH:mm:ss", CultureInfo.InvariantCulture);

           return dDateValue.Year + "-" + dDateValue.Month + "-" + dDateValue.Day;
            
        }

    }
}