M = readmatrix('verlet_dt=0.125.txt');
x(:,8) = M(:,1); y(:,8) = M(:,2);
%% Euler
figure('Name','y(x) (Euler)');
hold on;

plot(x(:,1),y(:,1),'Color','b','LineWidth',1);
plot(x(:,2),y(:,2),'Color','r','LineWidth',1);
plot(x(:,3),y(:,3),'Color','g','LineWidth',1);
plot(x(:,4),y(:,4),'Color','m','LineWidth',1);

title('y(x) (Euler)');
xlabel('x');
ylabel('y');
legend('\Delta t = 1','\Delta t = 0.5','\Delta t = 0.25','\Delta t = 0.125','Location','northwest');
set(gca,'FontName','Calibri','FontSize',21);
axis equal;
pbaspect([1 1 1]);
grid on;
%% Verlet
figure('Name','y(x) (Verlet)');
hold on;

plot(x(:,5),y(:,5),'Color','b','LineWidth',1);
plot(x(:,6),y(:,6),'Color','r','LineWidth',1);
plot(x(:,7),y(:,7),'Color','g','LineWidth',1);
plot(x(:,8),y(:,8),'Color','m','LineWidth',1);

title('y(x) (Verlet)');
xlabel('x');
ylabel('y');
legend('\Delta t = 1','\Delta t = 0.5','\Delta t = 0.25','\Delta t = 0.125','Location','northwest');
set(gca,'FontName','Calibri','FontSize',21);
axis equal;
pbaspect([1 1 1]);
grid on;