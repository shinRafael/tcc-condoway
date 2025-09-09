import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import styles from './Cards.module.css';

const StatusOcorrenciasCard = ({ title, data }) => {
  return (
    <div className={`${styles.card} ${styles.cardSpan2}`}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatusOcorrenciasCard;
