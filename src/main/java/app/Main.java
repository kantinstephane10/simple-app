package app;

import javax.swing.*;
import java.awt.*;

public class Main {

    public static void main(String[] args) {
        SwingUtilities.invokeLater(Main::createAndShowUI);
    }

    private static void createAndShowUI() {
        JFrame frame = new JFrame("Simple Counter App");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setSize(320, 200);
        frame.setLocationRelativeTo(null);
        frame.setResizable(false);

        int[] count = {0};

        JLabel countLabel = new JLabel("0", SwingConstants.CENTER);
        countLabel.setFont(new Font("SansSerif", Font.BOLD, 48));

        JButton incrementButton = new JButton("+");
        JButton decrementButton = new JButton("-");
        JButton resetButton = new JButton("Reset");

        incrementButton.addActionListener(e -> {
            count[0]++;
            countLabel.setText(String.valueOf(count[0]));
        });

        decrementButton.addActionListener(e -> {
            count[0]--;
            countLabel.setText(String.valueOf(count[0]));
        });

        resetButton.addActionListener(e -> {
            count[0] = 0;
            countLabel.setText(String.valueOf(count[0]));
        });

        JPanel buttonPanel = new JPanel(new GridLayout(1, 3, 8, 8));
        buttonPanel.add(decrementButton);
        buttonPanel.add(resetButton);
        buttonPanel.add(incrementButton);
        buttonPanel.setBorder(BorderFactory.createEmptyBorder(8, 8, 8, 8));

        frame.setLayout(new BorderLayout());
        frame.add(countLabel, BorderLayout.CENTER);
        frame.add(buttonPanel, BorderLayout.SOUTH);

        frame.setVisible(true);
    }
}
