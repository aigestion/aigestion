package com.aigestion.enterprise;

import android.app.Activity;
import android.os.Bundle;
import android.widget.TextView;
import android.graphics.Color;
import android.widget.LinearLayout;

public class MainActivity extends Activity {
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.parseColor("#0f0a27"));
        
        TextView title = new TextView(this);
        title.setText("AIGestion Enterprise");
        title.setTextSize(24);
        title.setTextColor(Color.WHITE);
        title.setPadding(20, 40, 20, 20);
        layout.addView(title);
        
        TextView subtitle = new TextView(this);
        subtitle.setText("Real-time System Monitoring");
        subtitle.setTextSize(16);
        subtitle.setTextColor(Color.parseColor("#a78bfa"));
        subtitle.setPadding(20, 0, 20, 30);
        layout.addView(subtitle);
        
        setContentView(layout);
    }
}
